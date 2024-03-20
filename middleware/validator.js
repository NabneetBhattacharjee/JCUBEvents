import { body, validationResult, matchedData } from "express-validator";

import { eventTypes } from "../config/app";

/**
 * Signup request validation rules
 */
export const validateSignup = () => {
  return [
    body("name")
      .trim()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("No special characters allowed")
      .isLength({ min: 3, max: 255 })
      .withMessage("Must be between 3 and 255 characters"),

    body("email").trim().isEmail().withMessage("Email invalid"),

    body("phone").trim().isNumeric().withMessage("Invalid phone number"),

    body("password")
      .isString()
      .isLength({ min: 6, max: 255 })
      .withMessage("Must be between 6 and 255 characters"),
  ];
};

/**
 * Login request validation rules
 */
export const validateLogin = () => {
  return [
    body("email").trim().isEmail().withMessage("Email invalid"),
    body("password")
      .isString()
      .isLength({ min: 6, max: 255 })
      .withMessage("Must be between 6 and 255 characters"),
  ];
};

/**
 * Event creation request validation rules
 */
export const validateEvent = () => {
  return [
    body("name")
      .trim()
      .isString()
      .withMessage("Event name is required")
      .isLength({ min: 3, max: 255 })
      .withMessage("Event name must be between 3 and 255 characters"),
    body("description")
      .trim()
      .isString()
      .withMessage("Event description is required")
      .isLength({ min: 15, max: 4096 })
      .withMessage("Event name must be between 15 and 4096 characters"),
    body("start_date").trim().isDate().withMessage("Start date invalid"),
    body("start_time").trim().isString().withMessage("Start time invalid"),
    body("location").trim().isString().withMessage("Event location invalid"),
    body("type")
      .trim()
      .isIn([eventTypes.free, eventTypes.paid])
      .withMessage(
        `Event type must be either "${eventTypes.free}" or "${eventTypes.paid}"`
      ),
  ];
};

/**
 * Event registration request validation rules
 */
export const validateEventRegistration = () => {
  return [
    body("student_id").trim().isString().withMessage("Student id is required"),
  ];
};

/**
 * Run validations according to defined rules
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    // Add the matched data to be used in the next middleware
    req.matchedData = matchedData(req);
    return next();
  }

  const formErrors = [];
  errors.array().map((err) => formErrors.push({ [err.param]: err.msg }));

  req.session.body = req.body;
  req.session.errors = formErrors;

  return res.redirect("back");
};
