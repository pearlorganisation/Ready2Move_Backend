import express from "express";
import {
  login,
  register,
  resendOTP,
  verifyOTP,
  logout,
} from "../../controllers/auth/auth.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP); // Implement resend after 30sec
router.route("/login").post(login);
router.route("/logout").post(authenticateToken, logout);

export default router;
