import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import Blog from "../../models/blog/blog.js";
import ApiError from "../../utils/error/ApiError.js";
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

export const getBlogBySlug = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params?.slug }).populate(
    "author",
    "name email role"
  );

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Fetched blog post successfully",
    data: blog,
  });
});

export const updateBlogBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const thumbImage = req.file;

  // Fetch the blog post to check for existing thumbImage
  const existingBlog = await Blog.findOne({ slug });
  if (!existingBlog) {
    return next(new ApiError("Blog post not found", 404));
  }

  let thumbImageResponse = null;

  // Delete the old thumbImage from Cloudinary if it exists and a new one is provided
  if (thumbImage) {
    thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs"); // Upload new thumbImage first
    if (existingBlog.thumbImage) {
      await deleteFileFromCloudinary(existingBlog.thumbImage); // If upload succeeds, delete the old thumbImage
    }
  }
  // Prepare the data for update
  const blogData = {
    ...req.body,
    thumbImage: thumbImageResponse ? thumbImageResponse[0] : undefined, // can't use null here as it set null in db if not required
  };

  // Find and update the blog post
  const updatedBlog = await Blog.findOneAndUpdate({ slug }, blogData, {
    new: true,
    runValidators: true,
  });

  // Check if update was successful
  if (!updatedBlog) {
    return next(new ApiError("Blog post not found or update failed", 404));
  }

  // Send success response
  return res.status(200).json({
    success: true,
    message: "Blog post updated successfully",
    data: updatedBlog,
  });
});

export const deleteBlogbyId = asyncHandler(async (req, res, next) => {
  const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

  if (!deletedBlog) {
    return next(new ApiError("Blog post not found", 404));
  }

  // Delete images from Cloudinary
  if (deletedBlog?.thumbImage)
    await deleteFileFromCloudinary(deletedBlog.thumbImage);

  return res
    .status(200)
    .json({ success: true, message: "Blog post deleted successfully" });
});
