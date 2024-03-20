import { Router } from "express";

import * as index from "../../controllers/api/IndexController";
import * as validator from "../../middleware/api/validator";

const router = Router();

// Assign owner role to the user making the request
router.post("/owner", validator.validateOwnerCode, index.createOwner);

module.exports = router;
