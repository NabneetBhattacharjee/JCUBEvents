import { Router } from "express";

const router = Router();

router.get("/forbidden", function (req, res) {
  res.locals.message = "Access to the requested resource is forbidden";
  res.render("error", { title: "Forbidden", httpStatus: 403 });
});

module.exports = router;
