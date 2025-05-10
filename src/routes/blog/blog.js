import express from "express";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import {
  createBlog,
  deleteBlogbyId,
  getAllBlogs,
  getBlogBySlug,
  updateBlogBySlug,
} from "../../controllers/blog/blog.js";
import { upload } from "../../middlewares/multer.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN]),
    upload.single("thumbImage"),
    createBlog
  )
  .get(getAllBlogs);

router
  .route("/:slug")
  .patch(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN]),
    upload.single("thumbImage"),
    updateBlogBySlug
  )
  .get(getBlogBySlug);

router
  .route("/:id")
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN]),
    deleteBlogbyId
  );

export default router;
