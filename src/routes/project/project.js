import express from "express";
import {
  createProject,
  deleteProjectById,
  getAllProjects,
  getProjectBySlug,
  searchProjects,
  updateProjectBySlug,
} from "../../controllers/project/project.js";
import { upload } from "../../middlewares/multer.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";
import handleUpload from "../../middlewares/handleUpload.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProjects) // no filtering, sorting and searching yet
  .post(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN, USER_ROLES_ENUM.BUILDER]),
    handleUpload(upload.array("imageGallery", 8)),
    createProject
  );

router.route("/search").get(searchProjects); // no filtering, sorting and searching yet

router
  .route("/:slug")
  .get(getProjectBySlug)
  .patch(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN, USER_ROLES_ENUM.BUILDER]),
    handleUpload(upload.array("imageGallery", 8)),
    updateProjectBySlug
  );

router
  .route("/:id")
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN, USER_ROLES_ENUM.BUILDER]),
    deleteProjectById
  );

export default router;
