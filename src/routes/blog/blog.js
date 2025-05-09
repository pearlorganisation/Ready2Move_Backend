import express from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import {
  createBlog,
  deleteBlogbyId,
  getAllBlogs,
  getBlogBySlug,
  updateBlogBySlug,
} from "../../controllers/blog/blog.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, upload.single("thumbImage"), createBlog) // who will create blog
  .get(getAllBlogs);

router
  .route("/:slug")
  .patch(authenticateToken, upload.single("thumbImage"), updateBlogBySlug) // who will create blog
  .get(getBlogBySlug);

router.route("/:id").delete(authenticateToken, deleteBlogbyId);

export default router;
