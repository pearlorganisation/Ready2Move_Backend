import { uploadFileToCloudinary } from "../../config/cloudinary.js";
import Blog from "../../models/blog/blog.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const createBlog = asyncHandler(async (req, res, next) => {
  const thumbImage = req.file;
  let thumbImageResponse = null;
  if (thumbImage) {
    thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs"); // Res-> [{}]
  }

  const blog = await Blog.create({
    ...req.body,
    author: req.user._id,
    thumbImage: (thumbImageResponse && thumbImageResponse[0]) || null, // If no image null will set, undefined ignored the field
  });

  if (!blog) {
    return next(new ApiError("Failed to create the blog post", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Blog post created successfully",
    data: blog,
  });
});

export const getAllBlogs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");
  const { search } = req.query;

  const filter = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  // Use the pagination utility function
  const { data: blogs, pagination } = await paginate(
    Blog,
    page,
    limit,
    filter,
    [{ path: "author", select: "name email" }],
    "-publishedAt"
  );

  // Check if no blogs found
  if (!blogs || blogs.length === 0) {
    return res
      .status(200)
      .json({ success: true, message: "No blogs found", data: [] });
  }

  // Return paginated response with ApiResponse
  return res.status(200).json({
    success: true,
    message: "Fetched all blogs successfully",
    pagination,
    data: blogs,
  });
});
