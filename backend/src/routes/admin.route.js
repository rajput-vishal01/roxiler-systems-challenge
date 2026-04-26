import express from "express";
import {
  getDashboard,
  getAllUsers,
  addUser,
  getUserById,
  getAllStores,
  addStore,
} from "../controller/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addUserSchema,
  addStoreSchema,
} from "../validators/admin.validator.js";

const router = express.Router();

// all admin routes are protected
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);
router.post("/users", validate(addUserSchema), addUser);
router.get("/users/:id", getUserById);
router.get("/stores", getAllStores);
router.post("/stores", validate(addStoreSchema), addStore);

export default router;
