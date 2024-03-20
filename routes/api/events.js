import { Router } from "express";

import * as validator from "../../middleware/api/validator";
import * as event from "../../controllers/api/EventController";

const router = Router();

// Add an event registration
router.post(
  "/:id/registrations",
  validator.validateMongoId,
  validator.validateStudentId,
  event.addRegistration
);

module.exports = router;
