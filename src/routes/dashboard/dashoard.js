import express from "express";
import { getDashboardMetrics } from "../../controllers/dashboard/dashboard.js";

const router = express.Router();

router.route("/metrics").get(getDashboardMetrics);

export default router;
