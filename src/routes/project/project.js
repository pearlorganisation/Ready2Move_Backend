import express from "express";
import {
  createProject,
  deleteProjectById,
  getAllProjects,
  getProjectBySlug,
  updateProjectBySlug,
} from "../../controllers/project/project.js";
import { upload } from "../../middlewares/multer.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProjects)
  .post(
    // authenticateToken,
    // verifyPermission([USER_ROLES_ENUM.ADMIN, USER_ROLES_ENUM.BUILDER]),
    upload.array("imageGallery", 8),
    createProject
  );

router
  .route("/:slug")
  .get(getProjectBySlug)
  .patch(upload.array("imageGallery", 8), updateProjectBySlug);

router.route("/:id").delete(deleteProjectById);

export default router;
