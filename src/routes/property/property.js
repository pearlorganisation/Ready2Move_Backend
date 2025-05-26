import express from "express";
import {
  createProperty,
  deletePropertyById,
  getAllProperties,
  getPropertyBySlug,
  searchProperties,
  updatePropertyBySlug,
} from "../../controllers/property/property.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";
import { upload } from "../../middlewares/multer.js";
import handleUpload from "../../middlewares/handleUpload.js";

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
    handleUpload(upload.array("imageGallery", 8)),
    createProperty
  )
  .get(optionalAuthenticateToken, getAllProperties);

router.route("/search").get(searchProperties); // Searching for home page.

router
  .route("/:slug")
  .get(getPropertyBySlug)
  .patch(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
      USER_ROLES_ENUM.USER,
    ]),
    handleUpload(upload.array("imageGallery", 8)),
    updatePropertyBySlug
  );

router
  .route("/:id")
  .delete(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
      USER_ROLES_ENUM.USER,
    ]),
    deletePropertyById
  );

export default router;
