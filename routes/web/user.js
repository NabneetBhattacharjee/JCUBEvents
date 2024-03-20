import { Router } from "express";

import { authOnly } from "../../middleware/auth";
import { userRole } from "../../middleware/role";
import * as user from "../../controllers/UserController";

const router = Router();

router.get("/events", authOnly, userRole, user.events);

module.exports = router;
