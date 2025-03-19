import express from "express";
import {
  createFeature,
  deleteFeatureById,
  getAllFeatures,
  updateFeatureById,
} from "../../controllers/feature/feature.js";

const router = express.Router();

router.route("/").get(getAllFeatures).post(createFeature); //By default paging is false, when showing on adminPanel paging will be on the basis of type

router.route("/:id").patch(updateFeatureById).delete(deleteFeatureById);

export default router;
