// Module dependencies
import envConfig from "../../config/env";
import { jsonResponse } from "./api-response";

/**
 * Handles server errors
 * @param {Error} err
 */
// eslint-disable-next-line no-unused-vars
export const serverError = (err, req, res, next) => {
  // Only log errors on development
  envConfig.node_env !== "production" && console.log(err);

  return jsonResponse(res, null, `ERROR: ${err.message}`, false, 500);
};

/**
 * Respond to client side errors
 * @param {String} msg
 */
export const badRequest = (res, data = null, msg = "Bad request") => {
  return jsonResponse(res, data, msg, false, 400);
};

/**
 * Respond to authorization errors
 * @param {String} msg
 */
export const unAuthorized = (
  res,
  data = null,
  msg = "Unauthorized request"
) => {
  return jsonResponse(res, data, msg, false, 401);
};

/**
 * Handle forbidden access
 * @param {tring} msg
 */
export const forbidden = (res, data = null, msg = "Access forbidden") => {
  return jsonResponse(res, data, msg, false, 403);
};
