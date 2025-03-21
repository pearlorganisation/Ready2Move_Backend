import express from "express";
import {
  createBanner,
  deleteBannerbyId,
  getAllBanner,
  updateBannerById,
} from "../../controllers/banner/banner.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("bgImage"), createBanner)
  .get(getAllBanner);

router
  .route("/:id")
  .patch(upload.single("bgImage"), updateBannerById)
  .delete(deleteBannerbyId);

export default router;
