import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectBySlug,
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
    // verifyPermission([USER_ROLES_ENUM.BUILDER]),
    upload.array("imageGallary", 10),
    createProject
  );

router.route("/:slug").get(getProjectBySlug);

export default router;
