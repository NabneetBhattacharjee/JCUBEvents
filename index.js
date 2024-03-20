// Module dependencies
//import path from "path";
//import express from "express";
//import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import flash from "connect-flash";
import createError from "http-errors";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import cookieParser from "cookie-parser";
import "express-async-errors";

import passportConfig from "./config/passport";
import envConfig from "./config/env";
import { configureRoutes } from "./config/routes";
import { databaseConfig } from "./config/database";
import { pages, eventTypes, roles } from "./config/app";

const path = require("path");

// Initialize Express application
const express = require("express");
const app = express();
const session = require("express-session");

// Start the database
databaseConfig();

// View engines
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Third Party Middleware
app.use(helmet());
app.use(logger("dev"));
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: envConfig.jwt.secret,
    store: MongoStore.create({
      mongoUrl: envConfig.mongo_uri,
      collectionName: "sessions",
    }),
    resave: false, // Force save session back to the session store
    saveUninitialized: true, // Force save an uninitialized session to store
    // cookie: { secure: true }, // Enable in production
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "/public")));

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware
app.use(function (req, res, next) {
  // Attach currently logged in user (Object|null)
  let user = req.user;
  if (user) {
    // Hide password for security reasons
    user.password = undefined;
    res.locals.user = user || null;
  }

  // Attach app configurations for use inside views
  res.locals.pages = pages;
  res.locals.eventTypes = eventTypes;
  res.locals.roles = roles;
  res.locals.app = envConfig.app;

  // Attach body data to session (Object)
  res.locals.body = req.session.body || {};
  delete req.session.body;

  // set success flash message (String)
  res.locals.success = req.session.success || "";
  delete req.session.success;

  // set error flash message (Array)
  res.locals.errors = req.session.errors || [];
  delete req.session.errors;

  next();
});

// Routes configurations
configureRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handling MUST COME AFTER OTHER MIDDLEWARES
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = envConfig.node_env === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Handle unresolved promises
process.on("unhandledRejection", (error, promise) => {
  if (envConfig.env === "development") {
    console.log("Occured in: ", promise);
    console.log("What happened? ", error.message);
  }
});

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  envConfig.env === "development" && console.log(error.message);
  process.exit(1);
});

// Listen for http connections
app.listen(envConfig.port, () =>
  console.log(`Server on ${envConfig.app.domain}`)
);
