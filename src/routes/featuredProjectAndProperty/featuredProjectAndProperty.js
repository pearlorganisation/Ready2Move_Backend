import express from "express";
import { getAllFeaturedProjectsAndProperties } from "../../controllers/featuredProjectAndProperty/featuredProjectAndProperty.js";

const router = express.Router();

router.route("/").get(getAllFeaturedProjectsAndProperties);

export default router;
