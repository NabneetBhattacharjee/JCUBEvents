import { Router } from "express";

import * as event from "../../controllers/EventController";

const router = Router();

// Home page
router.get("/", event.list);

// Search page
router.get("/search", event.search);

module.exports = router;
