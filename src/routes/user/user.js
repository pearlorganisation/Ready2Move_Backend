import express from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { loggedInUserData, refreshTokenController } from "../../controllers/user/user.js";

const router = express.Router()
router.route(`/me`).get(authenticateToken, loggedInUserData)
router.route(`/refresh-token`).post(refreshTokenController)
export default router