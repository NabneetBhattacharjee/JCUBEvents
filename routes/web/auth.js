import { Router } from "express";

import * as validator from "../../middleware/validator";
import { authOnly, guestOnly } from "../../middleware/auth";
import * as auth from "../../controllers/AuthController";

const router = Router();

// Signup
router
  .route("/signup")
  .get(guestOnly, auth.showSignup)
  .post(guestOnly, validator.validateSignup(), validator.validate, auth.signup);

// Login
router
  .route("/login")
  .get(guestOnly, auth.showLogin)
  .post(guestOnly, validator.validateLogin(), validator.validate, auth.login);

// Logout
router.post("/logout", authOnly, auth.logout);

module.exports = router;
