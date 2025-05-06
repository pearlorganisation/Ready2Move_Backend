import express from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { createBlog, getAllBlogs } from "../../controllers/blog/blog.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, upload.single("thumbImage"), createBlog) // who will create blog
  .get(getAllBlogs);

export default router;
