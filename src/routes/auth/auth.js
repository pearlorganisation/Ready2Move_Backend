import express from "express";
import {
  login,
  register,
  resendOTP,
  verifyOTP,
  logout,
  forgotPassword,
  resetPassword,
} from "../../controllers/auth/auth.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authenticateToken, logout);
router.route("/forgot-password").post(forgotPassword); // forgot password-> verify otp -> reset password
router.route("/reset-password").patch(resetPassword);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);

export default router;
