import express from "express";
import {
  updatePassword,
  getDashboard,
} from "../controller/storeOwner.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updatePasswordSchema } from "../validators/user.validator.js";

const router = express.Router();

router.use(verifyJWT);
router.use(authorizeRoles("STORE_OWNER"));

router.put("/password", validate(updatePasswordSchema), updatePassword);
router.get("/dashboard", getDashboard);

export default router;
