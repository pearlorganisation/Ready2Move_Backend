import express from "express";
import {
  createFeature,
  getAllFeatures,
} from "../../controllers/feature/feature.js";

const router = express.Router();

router.route("/").get(getAllFeatures).post(createFeature);

export default router;
