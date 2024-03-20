import { Router } from "express";

import * as event from "../../controllers/EventController";
import { authOnly } from "../../middleware/auth";
import { ownerRole, userRole } from "../../middleware/role";
import * as validator from "../../middleware/validator";

const router = Router();

router.param("id", event.check);

// Add new event
router.post(
  "/",
  authOnly,
  ownerRole,
  event.uploadLogo,
  validator.validateEvent(),
  validator.validate,
  event.store
);

// Show new event form
router.get("/create", authOnly, ownerRole, event.create);

// Show events dashboard page
router.get("/dashboard", event.dashboard);

router
  .route("/:id")
  // Show a single event by its id
  .get(event.show)
  // Update an existing event by its id
  .post(
    authOnly,
    ownerRole,
    event.uploadLogo,
    validator.validateEvent(),
    validator.validate,
    event.update
  );

// Show form to edit a single event
router.get("/:id/edit", authOnly, ownerRole, event.edit);

// Show event registrations
router.get("/:id/registrations", authOnly, ownerRole, event.registrations);

// Show event registration creation form
router.get(
  "/:id/registrations/create",
  authOnly,
  userRole,
  event.createRegistration
);

// Save new registration for the provided event
router.post(
  "/:id/registrations/store",
  authOnly,
  userRole,
  validator.validateEventRegistration(),
  validator.validate,
  event.storeRegistration
);

// Cancel event registration
router.post(
  "/:id/registrations/cancel",
  authOnly,
  userRole,
  event.cancelRegistration
);

// Export event registrations
router.get(
  "/:id/registrations/export",
  authOnly,
  ownerRole,
  event.registrationsExport
);

module.exports = router;
