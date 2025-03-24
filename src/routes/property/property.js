import express from "express";
import { createProperty } from "../../controllers/property/property.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
      USER_ROLES_ENUM.USER,
    ]),
    upload.array("imageGallery", 8),
    createProperty
  );

export default router;
