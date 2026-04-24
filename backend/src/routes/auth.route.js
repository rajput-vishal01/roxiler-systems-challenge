import express from "express";

import {
  signup,
  login,
  logout,
  generateRefreshAccessToken,
} from "../controller/auth.controller.js";

import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", generateRefreshAccessToken);
router.post("/logout", verifyJWT, logout);

export default router;
