import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import Project from "../../models/project/project.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";
import { safeParse } from "../../utils/safeParse.js";

export const createProject = asyncHandler(async (req, res, next) => {
  const imageGallery = req.files; // [{}, {}]
  let imageGalleryResponse = null;

  if (imageGallery) {
    imageGalleryResponse = await uploadFileToCloudinary(
      imageGallery,
      "Project"
    );
  }
  const project = await Project.create({
    user: req.user._id,
    ...req.body,
    areaRange: safeParse(req.body.areaRange),
    priceRange: safeParse(req.body.priceRange),
    availability: safeParse(req.body.availability),
    aminities: safeParse(req.body.aminities),
    bankOfApproval: safeParse(req.body.bankOfApproval),
    imageGallery: imageGalleryResponse.length > 0 ? imageGalleryResponse : [],
  });

  if (!project) {
    return next(new ApiError("Failed to create the Project", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

export const getProjectBySlug = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params?.slug }).populate([
    { path: "availability", select: "name type" },
    { path: "aminities", select: "name type" },
    { path: "bankOfApproval", select: "name type" },
  ]);

  if (!project) {
    return next(new ApiError("University not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Project found successfully",
    data: project,
  });
});

export const getAllProjects = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query; //Since the object is empty, the default values remain.
  const { data: projects, pagination } = await paginate(
    Project,
    parseInt(page),
    parseInt(limit),
    {},
    [
      {
        path: "availability",
        select: "name type",
      },
      {
        path: "aminities",
        select: "name type",
      },
      {
        path: "bankOfApproval",
        select: "name type",
      },
    ]
  );

  if (!projects || projects.length === 0) {
    return next(new ApiError("No Projects found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "All Projects found successfully",
    pagination,
    data: projects,
  });
});

// Can add images and delete images independently and simultaneously too
export const updateProjectBySlug = asyncHandler(async (req, res, next) => {
  let { deleteImages, ...otherFields } = req.body;

  const imageGallery = req.files;
  let imageGalleryResponse = null;

  // Find the project first
  const project = await Project.findOne({ slug: req.params?.slug });

  if (!project) {
    return next(new ApiError("Project not found", 404));
  }
  if (!Array.isArray(deleteImages)) {
    deleteImages = deleteImages ? [deleteImages] : []; // Convert to array or default to an empty array
  }
  // Filter out empty values
  const validDeleteImages = deleteImages.filter((img) => img.trim() !== "");

  // Step 1: Delete images only if there are valid ones
  if (validDeleteImages.length > 0) {
    for (const image of validDeleteImages) {
      await deleteFileFromCloudinary({ public_id: image });
    }
  }

  // Step 2: Upload new images
  if (imageGallery) {
    imageGalleryResponse = await uploadFileToCloudinary(
      imageGallery,
      "Project"
    );
  }

  // Step 3: Create bulkWrite operations
  const bulkOperations = [];

  // Delete images from MongoDB
  if (deleteImages?.length > 0) {
    bulkOperations.push({
      updateOne: {
        filter: { slug: req.params?.slug },
        update: {
          $pull: { imageGallery: { public_id: { $in: deleteImages } } },
        },
      },
    });
  }

  // Add new images to MongoDB
  if (imageGalleryResponse?.length > 0) {
    bulkOperations.push({
      updateOne: {
        filter: { slug: req.params?.slug },
        update: { $push: { imageGallery: { $each: imageGalleryResponse } } },
      },
    });
  }

  // Update other fields in MongoDB
  if (Object.keys(otherFields).length > 0) {
    bulkOperations.push({
      updateOne: {
        filter: { slug: req.params?.slug },
        update: {
          $set: {
            ...otherFields,
            areaRange: safeParse(otherFields.areaRange),
            priceRange: safeParse(otherFields.priceRange),
            availability: safeParse(otherFields.availability),
            aminities: safeParse(otherFields.aminities),
            bankOfApproval: safeParse(otherFields.bankOfApproval),
          },
        },
      },
    });
  }

  // Execute bulkWrite only if there are operations
  if (bulkOperations.length > 0) {
    await Project.bulkWrite(bulkOperations);
  }

  // Fetch the updated project
  const updatedProject = await Project.findOne({ slug: req.params?.slug });

  return res.status(200).json({
    success: true,
    message: "Updated the Project successfully",
    data: updatedProject,
  });
});

export const deleteProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(new ApiError("Project not found", 404));
  }
  if (project?.imageGallery)
    await deleteFileFromCloudinary(project.imageGallery);
  return res
    .status(200)
    .json({ success: true, message: "Deleted the Project successfully" });
});
