import { pages } from "../config/app";
import { roles } from "../config/app";

/**
 * Grant access to regular users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const userRole = (req, res, next) => {
  if (req.user.role === roles.admin || req.user.role === roles.user) {
    return next();
  }
  return res.redirect(pages.errors.forbidden);
};

/**
 * Grant access to users with owner role
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const ownerRole = (req, res, next) => {
  if (req.user.role === roles.admin || req.user.role === roles.owner) {
    return next();
  }
  return res.redirect(pages.errors.forbidden);
};

/**
 * Grant access to administrators only
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const adminRole = (req, res, next) => {
  if (req.user.role === roles.admin) {
    return next();
  }
  return res.redirect(pages.errors.forbidden);
};
