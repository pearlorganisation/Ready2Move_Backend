import express from "express";
import { getAllUsers } from "../../controllers/user/user.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticateToken, getAllUsers);

export default router;
