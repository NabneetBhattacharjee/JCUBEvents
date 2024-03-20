import { Router } from "express";

const router = Router();

router.get("/", function (req, res) {
  res.locals.message = "Page not found";
  res.render("error", { title: "Not Found", httpStatus: 404 });
});

module.exports = router;
