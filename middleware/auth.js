import { pages } from "../config/app";

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authOnly = (req, res, next) => {
  if (!req.user) {
    req.session.returnUrl = req.originalUrl;
    req.session.errors = ["You must be logged in to view that page"];
    return res.redirect(pages.auth.login);
  }

  return next();
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const guestOnly = (req, res, next) => {
  if (req.user) {
    return res.redirect(pages.home);
  }

  return next();
};
