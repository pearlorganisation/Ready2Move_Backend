import express from "express";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import Blog from "../../models/blog/blog.js";
import { uploadImageToCloudinary } from "../../config/cloudinary.js";
import ApiError from "../../utils/error/ApiError.js"; 
import  cloudinary  from "cloudinary";

export const createBlog = asyncHandler(async (req, res, next) => {
  const { title, description, userId } = req.body;
  const imageBuffer = req.file?.buffer;

  if (!title || !description || !userId) {
    return next(new ApiError("Title, description, and userId are required", 400));
  }

  if (!imageBuffer) {
    return next(new ApiError("Image file is required", 400));
  }

  try {
    const uploadedImage = await uploadImageToCloudinary(imageBuffer);

    console.log("Image uploaded successfully: ", uploadedImage.secure_url);

    const newBlog = await Blog.create({
      title,
      description,
      thumbnail_image: {
        public_id: uploadedImage.public_id,
        secure_url: uploadedImage.secure_url,
      },
      author: userId,
    });

    // Send the response with the new blog post data
    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: {
        id: newBlog._id, 
        title,
        description,
        author: userId,
        thumbnail_image: uploadedImage.secure_url,
      },
    });
  } catch (error) {
    console.error("Error uploading image or creating blog:", error);

    // If the error is specific to Cloudinary, handle it
    if (error.message.includes("Error uploading image")) {
      return next(new ApiError("Error uploading image to Cloudinary", 500));
    }

    // Handle other errors (like database errors)
    return next(new ApiError("Error creating blog post", 500));
  }
});



//Get All Blogs--------------------------------------------------------
export const getAllBlogs = asyncHandler(async (req, res, next) => {

  try {
    const allBlogs = await Blog.find({}).populate("author");
    return res.status(200).json({
      success: true,
      message: "All Blogs fetched successfully",
      data: allBlogs,
    });
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return next(new ApiError("Error fetching all blogs", 500));
  }
});



//Get Specific Blog--------------------------------------------------------
export const getSingleBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate("author", "name");
    if (!blog) {
      return next(new ApiError("Blog not found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return next(new ApiError("Error fetching blog", 500));
  }
    })


//Delete Specific Blog--------------------------------------------------------

export const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;    

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if(!deletedBlog){
        return res.status(404).json({
            success: false,
            message: "Blog not found"
        })
    }
    const result = await cloudinary.v2.uploader.destroy(deletedBlog.thumbnail_image.public_id, {
        resource_type: 'image', 
      });
    console.log('Image deleted:', result);
    console.log("delete public id ",deletedBlog.thumbnail_image.public_id);
    if (!deletedBlog) {
      return next(new ApiError("Blog not found", 404));
    }
     
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return next(new ApiError("Error deleting blog", 500));  
  }
})


//Update Specific blog --------------------------------------------------------
export const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;
 let uploadedImage = null

  const imageBuffer = req.file?.buffer;
  
try {

    if(imageBuffer){
        const BlogToUpdate = await Blog.findById(id)
        const result = await cloudinary.v2.uploader.destroy(BlogToUpdate.thumbnail_image.public_id, {
        resource_type: 'image', 
        });
        console.log("after deleteing" , result)
      uploadedImage = await uploadImageToCloudinary(imageBuffer);

     console.log("Image uploaded successfully: ", uploadedImage.secure_url);

       

    }

const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description ,  
        thumbnail_image: {
        public_id: uploadedImage.public_id,
        secure_url: uploadedImage.secure_url,
      },},
      { new: true }
    );
    if (!updatedBlog) {
      return next(new ApiError("Blog not found", 404));
    }        
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return next(new ApiError("Error updating blog", 500));
  }
});