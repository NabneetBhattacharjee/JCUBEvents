import path from "path";
import multer from "multer";
import mongoose from "mongoose";

import EventService from "../services/EventService";
import StudentService from "../services/StudentService";
import { pages } from "../config/app";

/**
 * Upload the event logo
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const uploadLogo = (req, res, next) => {
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads/");
      },
      filename: function (req, file, cb) {
        const filename = Date.now() + "-" + file.originalname;
        req.filename = filename;
        cb(null, filename);
      },
    }),

    limits: {
      fileSize: 1000 * 1000, // 5mb
    },

    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);

      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        return cb(new Error("Only images are allowed"));
      }
      cb(null, true);
    },
  }).single("logo")(req, res, next);
};

/**
 * Validate the provided event id and check if the event exists
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const check = async (req, res, next) => {
  const id = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    res.locals.message = "Invalid document id";
    return res.render("error", { title: "404", httpStatus: 404 });
  }

  const event = await EventService.findEventById(req.params.id);
  if (!event) {
    res.locals.message = "Page not found";
    return res.render("error", { title: "404", httpStatus: 404 });
  }
  req.currentEvent = event;
  next();
};

/**
 * Show form to create a new event
 * @param {*} req
 * @param {*} res
 */
export const create = (req, res) => {
  res.render("events/create", { title: "Create Event" });
};

/**
 * Show form to edit an event
 * @param {*} req
 * @param {*} res
 */
export const edit = (req, res) => {
  const event = req.currentEvent;
  res.render("events/edit", {
    title: `Edit | ${event.name}`,
    tab: pages.events.item(event.id).edit,
    event,
  });
};

/**
 * Store a new event in the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const store = async (req, res) => {
  // Return if no file was uploaded
  if (!req.file) {
    req.session.body = req.body;
    req.session.errors = [{ logo: "Logo is required" }];
    res.status(400);
    return res.redirect("back");
  }

  // Save event
  await EventService.storeEvent({
    ...req.body,
    owner: req.user.id,
    logo: {
      name: req.filename,
      path: `/uploads/${req.filename}`,
    },
  });

  return res.redirect(pages.events.dashboard);
};

/**
 * Display the owner's event dashboard
 * @param {*} req
 * @param {*} res
 */
export const dashboard = async (req, res) => {
  // Get user events
  const events = await EventService.ownerEvents(req.user.id);

  res.render("events/dashboard", { title: "Events Dashboard", events });
};

/**
 * Display a single event record
 * @param {*} req
 * @param {*} res
 */
export const show = async (req, res) => {
  const event = await EventService.eventRegistrations(req.params.id);

  let hasRegistered, registerRecord;
  if (req.user && event.registrations.length > 0) {
    registerRecord = event.registrations.find((item) =>
      item.user.equals(req.user.id)
    );
    if (registerRecord) hasRegistered = true;
  }

  return res.render("events/show", {
    event,
    title: event.name,
    tab: pages.events.item(event.id).show,
    hasRegistered,
    registerRecord,
  });
};

/**
 * Update a single event with its id
 * @param {*} req
 * @param {*} res
 */
export const update = async (req, res) => {
  let logo = undefined;

  if (req.file) {
    logo = { name: req.filename, path: `/uploads/${req.filename}` };
  }

  const event = await EventService.updateEvent({
    ...req.body,
    id: req.params.id,
    logo,
    event: req.currentEvent,
  });

  req.session.success = `${event.name} updated successfully`;

  return res.redirect(pages.events.item(req.params.id).show);
};

/**
 * Get the event registration page
 * @param {*} req
 * @param {*} res
 */
export const registrations = async (req, res) => {
  const event = await EventService.eventRegistrations(req.params.id);

  res.render("events/registrations", {
    title: `Registrations | ${event.name}`,
    tab: pages.events.item(event.id).registrations,
    event,
  });
};

/**
 * Show form to create a new event registration
 * @param {*} req
 * @param {*} res
 */
export const createRegistration = async (req, res) => {
  const event = req.currentEvent;

  res.render("events/create-registration", {
    title: `Create Registration for ${event.name}`,
    event,
  });
};

/**
 * Store a new registration for the provided event
 * @param {*} req
 * @param {*} res
 */
export const storeRegistration = async (req, res) => {
  const { student_id } = req.matchedData;
  const event_id = req.params.id;
  const user_id = req.user.id;

  const isValid = mongoose.Types.ObjectId.isValid(student_id);

  if (!isValid) {
    req.session.errors = ["Invalid student id"];
    return res.redirect("back");
  }

  const student = await StudentService.findById(student_id);

  if (!student) {
    req.session.errors = ["Student with that id not found"];
    return res.redirect("back");
  } else if (student.reg_event?.equals(req.params.id)) {
    req.session.errors = ["You cannot register for an event twice"];
    return res.redirect("back");
  }

  await StudentService.addRegistration(student_id, event_id);

  await EventService.addEventRegistration(event_id, student_id, user_id);

  res.redirect(pages.events.item(event_id).show);
};

/**
 * Cancel event registration
 * @param {*} req
 * @param {*} res
 */
export const cancelRegistration = async (req, res) => {
  const event_id = req.params.id;
  const student_id = req.body.student_id;
  const user_id = req.user.id;

  await StudentService.removeRegistration(student_id);

  await EventService.removeEventRegistration(event_id, user_id);

  return res.redirect(pages.events.item(event_id).show);
};

/**
 * Export the event registrations
 * @param {*} req
 * @param {*} res
 */
export const registrationsExport = async (req, res) => {
  let students = await StudentService.findRegistered(req.params.id);

  if(students.length > 0) {
    students = students.map((student) => {
      student.id = String(student._id);
      student.reg_event = String(student.reg_event);

      delete student._id,student.reg_event;
      return student;
    });
  }

  const { filepath } = await EventService.exportRegistrations(
    students,
    "export-" + Date.now() + ".xlsx"
  );

  return res.sendFile(filepath);
};

/**
 * Search for events with given parameter
 * @param {*} req
 * @param {*} res
 */
export const search = async (req, res) => {
  const events = await EventService.searchEvents({
    name: new RegExp(req.query.q, "i"),
  });

  return res.render("search", {
    events,
    title: "Search results",
    query: req.query.q,
  });
};

/**
 * Display a list of all published events that are
 * available for public viewing.
 * @param {*} req
 * @param {*} res
 */
export const list = async (req, res) => {
  const events = await EventService.publishedEvents();

  return res.render("index", { events });
};
