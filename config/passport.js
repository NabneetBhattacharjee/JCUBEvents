import { Strategy } from "passport-local";

import User from "../models/User";

export default (passport) => {
  passport.use(
    new Strategy(
      { usernameField: "email", passReqToCallback: true },

      async function (req, username, password, done) {
        const user = await User.findOne({ email: username });

        if (!user) {
          req.session.body = req.body;
          req.session.errors = [{ email: "User not found" }];
          return done(null, false);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          req.session.body = req.body;
          req.session.errors = [{ error: "Incorrect email/password" }];
          return done(null, false);
        }

        return done(null, user);
      }
    )
  );

  // Add user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Remove user from session
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
