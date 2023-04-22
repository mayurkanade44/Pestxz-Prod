import express from "express";
const router = express.Router();

import {
  allUsers,
  changePassword,
  deleteUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { authenticateUser, authorizeUser } from "../middleware/auth.js";
import { weeklyReport } from "../controllers/reportController.js";

router.route("/login").post(loginUser);
router.route("/autoWeeklyReport").get(weeklyReport);
router
  .route("/register")
  .post(authenticateUser, authorizeUser("Admin"), registerUser);
router
  .route("/allUser")
  .get(authenticateUser, authorizeUser("Admin"), allUsers);
router
  .route("/update/:id")
  .delete(authenticateUser, authorizeUser("Admin"), deleteUser)
  .patch(authenticateUser, authorizeUser("Admin"), changePassword);

export default router;
