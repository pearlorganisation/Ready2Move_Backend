import express from "express";
import { getDashboardMetrics } from "../../controllers/dashboard/dashboard.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router.route("/metrics").get(
  authenticateToken,
  verifyPermission([
    // change the permissions to the ones you want ask client
    USER_ROLES_ENUM.ADMIN,
    USER_ROLES_ENUM.BUILDER,
    USER_ROLES_ENUM.AGENT,
  ]),
  getDashboardMetrics
);

export default router;
