

import index from "../routes/web/index";
import auth from "../routes/web/auth";
import api from "../routes/api/index";
import eventsApi from "../routes/api/events";
import events from "../routes/web/events";
import notfound from "../routes/web/404";
import error from "../routes/web/error";
import user from "../routes/web/user";

export const configureRoutes = (app) => {
  app.use("/", index);
  app.use("/api", api);
  app.use("/api/events", eventsApi);
  app.use("/events", events);
  app.use("/auth/", auth);
  app.use("/user/", user);
  app.use(["/errors/"], error);

  // This endpoint MUST come last
  app.use("*", notfound);
};
