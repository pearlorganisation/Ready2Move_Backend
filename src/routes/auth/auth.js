import express from "express";
import { login, register, verifyOTP } from "../../controllers/auth/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(login);

export default router;
