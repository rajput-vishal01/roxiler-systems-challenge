import express from "express";
import {
  updatePassword,
  getStores,
  submitRating,
  updateRating,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  updatePasswordSchema,
  ratingSchema,
} from "../validators/user.validator.js";

const router = express.Router();

router.use(verifyJWT);
router.use(authorizeRoles("USER"));

router.put("/password", validate(updatePasswordSchema), updatePassword);
router.get("/stores", getStores);
router.post("/ratings", validate(ratingSchema), submitRating);
router.put("/ratings", validate(ratingSchema), updateRating);

export default router;
