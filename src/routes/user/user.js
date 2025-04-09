import express from "express";
import {
  forgotPassword,
  getAllUsers,
  getUserData,
  refreshTokenController,
  updateUserData,
} from "../../controllers/user/user.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticateToken, getAllUsers);
router
  .route("/me")
  .get(authenticateToken, getUserData)
  .patch(authenticateToken, updateUserData);

router.route("/refresh-token").post(refreshTokenController);
router.route("/forgot-password").post(forgotPassword);

export default router;
