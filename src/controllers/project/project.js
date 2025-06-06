import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import { buildProjectSearchPipeline } from "../../helpers/aggregationPipelines.js";
import Project from "../../models/project/project.js";
import { buildPaginationObject } from "../../utils/buildPaginationObject.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { generatePagesArray } from "../../utils/generatePagesArray.js";
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
    return next(new ApiError("Project not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Project found successfully",
    data: project,
  });
});

export const getAllProjects = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    service,
    projectType,
    priceRange,
    areaRange,
    q,
  } = req.query;

  const filter = {};

  // ROLE-BASED FILTERING
  if (req.user && req.user.role !== "ADMIN" && req.user.role !== "AGENT") {
    // Authenticated non-admin (only for BUILDER) → only their own projects
    filter.user = req.user._id;
  }
  // If no req.user (public) or admin, allow access to all projects

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }, // Partial match
      { locality: { $regex: q, $options: "i" } }, // Partial match
      { city: { $regex: q, $options: "i" } }, // Partial match
      { state: { $regex: q, $options: "i" } }, // Partial match
      { service: { $regex: q, $options: "i" } }, // Partial match
      { projectType: { $regex: q, $options: "i" } }, // Partial match
      { reraNumber: { $regex: q, $options: "i" } }, // Partial match
    ];
  }
  if (service) {
    filter.service = { $regex: `^${service}$`, $options: "i" };
  }
  if (projectType) {
    filter.projectType = { $regex: `^${projectType}$`, $options: "i" };
  }

  // PRICE FILTERING
  if (priceRange) {
    const [min, max] = priceRange.split(",").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filter["priceRange.max"] = { $gte: min };
      filter["priceRange.min"] = { $lte: max };
    }
  }

  // AREA FILTERING
  if (areaRange) {
    const [min, max] = areaRange.split(",").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filter["areaRange.max"] = { $gte: min }; // max area must be greater than or equal to min area
      filter["areaRange.min"] = { $lte: max }; // min area must be less than or equal to max area
    }
  }

  const { data: projects, pagination } = await paginate(
    Project,
    parseInt(page),
    parseInt(limit),
    filter,
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
    return res.status(200).json({
      success: true,
      message: "No projects found.",
      data: [],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Projects found successfully",
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
    message: "Updated the Project successfully.",
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

export const searchProjects = asyncHandler(async (req, res, next) => {
  const { q, page = 1, limit = 10, service, projectType } = req.query;
  if (!q || q.trim() === "") {
    return next(new ApiError("Search query is required", 400));
  }

  // Run main search query with pagination
  const pipline = buildProjectSearchPipeline(
    q,
    parseInt(page),
    parseInt(limit),
    { service, projectType }
  );
  console.log("pipeline: ", JSON.stringify(pipline, null, 2));
  const [result] = await Project.aggregate(pipline);
  const projects = result?.data || [];

  if (!projects || projects.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No projects found.",
      data: [],
    });
  }

  const totalResults = result?.count[0]?.total || 0;
  const totalPages = Math.ceil(totalResults / parseInt(limit));

  // Generate Pagination Array
  const pagesArray = generatePagesArray(totalPages, parseInt(page));

  // Build Pagination Object
  const pagination = buildPaginationObject({
    totalResults,
    page,
    limit,
    totalPages,
    pagesArray,
  });

  return res.status(200).json({
    success: true,
    message: "Projects found successfully",
    pagination,
    data: projects,
  });
});
