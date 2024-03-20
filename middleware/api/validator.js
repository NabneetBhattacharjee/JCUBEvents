// Module dependencies
import Joi from "joi";
import mongoose from "mongoose";

import envConfig from "../../config/env";
import { badRequest } from "./errors";

/**
 * Schemas for Joi validation
 */
export const singleSchema = {
  validString: Joi.string().required(),

  validNumer: Joi.number().required(),
};

/**
 * Check if provided id is a valid mongoose object id
 * @param {String} id
 */
export const isIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Helper to handle validation errors.
 *
 * @access private
 * @param {Error} error
 * @param {*} value
 */
function handleValidationResults(req, res, next, error, value) {
  if (error) {
    envConfig.node_env !== "production" && console.log(error);
    return badRequest(res, req.body, error.message);
  }
  req.matchedData = value;
  next();
}

/**
 * Middleware to validate mongo id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validateMongoId = (req, res, next) => {
  if (!isIdValid(req.params.id)) return badRequest(res, null, "Invalid id");
  next();
};

/**
 * Validate the code used to activate owner role
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validateOwnerCode = (req, res, next) => {
  const owner_code = req.body.owner_code;
  const { error, value } = Joi.object({
    owner_code: singleSchema.validString,
  }).validate({ owner_code });
  handleValidationResults(req, res, next, error, value);
};

/**
 * Validate the student id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validateStudentId = (req, res, next) => {
  const student_id = req.body.student_id;

  if (!isIdValid(student_id)) {
    return badRequest(res, null, "Student id is invalid");
  }

  const { error, value } = Joi.object({
    student_id: singleSchema.validString,
  }).validate({ student_id });
  handleValidationResults(req, res, next, error, value);
};
