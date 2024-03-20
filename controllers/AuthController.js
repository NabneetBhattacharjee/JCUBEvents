import passport from "passport";

import UserService from "../services/UserService";
import { pages } from "../config/app";

/**
 * Send form to login user
 * @param {*} req
 * @param {*} res
 */
export const showLogin = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

/**
 * Send form to create a new user
 * @param {*} req
 * @param {*} res
 */
export const showSignup = (req, res) => {
  res.render("auth/signup", { title: "Signup" });
};

/**
 * Authenticate a user
 * @param {*} req
 * @param {*} res
 */
export const login = async (req, res, next) =>
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);

    if (!user) return res.redirect(pages.auth.login);

    req.login(user, (err) => {
      if (err) return next(err);
    });

    if (req.session.returnUrl) {
      return res.redirect(req.session.returnUrl);
    }

    return res.redirect(pages.home);
  })(req, res, next);

/**
 * Store a new user into the database
 * @param {*} req
 * @param {*} res
 */
export const signup = async (req, res, next) => {
  const data = req.matchedData;

  if (await UserService.checkUserByEmail(data.email)) {
    req.session.body = req.body;
    req.session.errors = [{ email: "User already registered" }];

    return res.redirect("back");
  }

  const user = await UserService.createUser(data);

  req.login(user, function (err) {
    if (err) return next(err);
  });

  return res.redirect(pages.home);
};

/**
 * Remove authenticated user from session
 * @param {*} req
 * @param {*} res
 */
export const logout = async (req, res) => {
  req.session.destroy();

  res.redirect(pages.home);
};
