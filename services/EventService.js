import XLSX from "xlsx";
import QRCode from "qrcode";
import path from "path";

import Event from "../models/Event";

import env from "../config/env";
import { pages } from "../config/app";

/**
 * Service handler for the Event model
 */
export default class EventService {
  /**
   * Find an event by its id
   * @param {String} id
   */
  static async findEventById(id) {
    return await Event.findById(id);
  }

  /**
   * Store a new Event into the database
   * @param {object} eventData
   */
  static async storeEvent(eventData) {
    // Destructure data
    const { name, description, start_date, start_time } = eventData;
    const { end_date, end_time, location, logo, type, owner } = eventData;

    // Save new event
    const newEvent = await new Event({
      name,
      description,
      start_date,
      start_time,
      location,
      type,
      owner,
      logo: { name: logo.name, path: logo.path },
      end_date: end_date || null,
      end_time: end_time || null,
    }).save();

    // Attach the QRCode
    const qrCode = await this.createEventQRCode(newEvent.id);
    newEvent.update({ $set: { qrCode } }).exec();

    return newEvent;
  }

  /**
   * Update an event by its id
   * @param {object} eventData
   */
  static async updateEvent(eventData) {
    // Destructure data
    const { name, description, start_date, start_time, id } = eventData;
    const { end_date, end_time, location, type, logo, event } = eventData;

    // Update the document
    const updated = await Event.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          description,
          start_date,
          start_time,
          location,
          type,
          logo: logo
            ? { name: logo.name, path: logo.path }
            : { name: event.logo.name, path: event.logo.path },
          end_date: end_date || null,
          end_time: end_time || null,
        },
      },
      { upsert: true, new: true }
    );

    return updated;
  }

  /**
   * Get the events owned by the provided owner
   * @param {String} ownerId
   */
  static async ownerEvents(ownerId) {
    return await Event.find({ owner: ownerId });
  }

  /**
   * Find events where condition meets the provided parameters
   * @param {object} param
   */
  static async searchEvents(param) {
    return await Event.find(param);
  }

  /**
   * Get all published events in the system
   */
  static async publishedEvents() {
    return await Event.find({ is_active: true });
  }

  /**
   * Add student registration to the event
   * @param {String} eventId
   * @param {String} studentId
   * @param {String} userId
   */
  static async addEventRegistration(eventId, studentId, userId) {
    return await Event.findOneAndUpdate(
      { _id: eventId },
      { $addToSet: { registrations: { student: studentId, user: userId } } }
    );
  }

  /**
   * Remove student registration from the event
   * @param {String} eventId
   * @param {String} userId
   */
  static async removeEventRegistration(eventId, userId) {
    return await Event.findOneAndUpdate(
      { _id: eventId },
      { $pull: { registrations: { user: userId } } }
    );
  }

  /**
   * Get the registrations for this event
   * @param {String} eventId
   */
  static async eventRegistrations(eventId) {
    const event = await this.findEventById(eventId);
    return await event.populate("registrations.student").execPopulate();
  }

  /**
   * Create QRCode for an event
   * @param {String} eventId
   */
  static async createEventQRCode(eventId) {
    return await QRCode.toDataURL(
      `${env.app.domain}${pages.events.item(eventId).createRegistration}`
    );
  }

  /**
   * Handles creating and exporting the collection data provided
   * @param {Array} collectionData
   * @param {String} filename
   */
  static async exportRegistrations(collectionData, filename) {
    const workBook = XLSX.utils.book_new();
    const filepath = path.join(__dirname, "../public/exports/" + filename);

    const book_append = async (workBook) => {
      const workSheet = XLSX.utils.json_to_sheet(collectionData);
      XLSX.utils.book_append_sheet(workBook, workSheet, filename);
      return workSheet;
    };

    await book_append(workBook);

    XLSX.writeFile(workBook, filepath);

    return { workBook, filepath };
  }

  /**
   * Get the events that this user has registerd for
   * @param {object} user
   */
  static async getUserEvents(user) {
    const events = await Event.find({
      "registrations.user": { $in: [user.id] },
    });

    return events;
  }
}
