import { Router } from "express";
import multer from "multer";
import { createBlog, deleteBlog, getAllBlogs, getSingleBlog, updateBlog } from "../../controllers/blog/blog.js";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const blogRouter = Router();
blogRouter.get("/all", getAllBlogs);

blogRouter.route("/create").post(upload.single('image'), createBlog);

blogRouter.route("/:id").delete(deleteBlog).get(getSingleBlog).patch(upload.single('image') , updateBlog);


export default blogRouter;
