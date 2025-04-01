import { uploadFileToCloudinary } from "../../config/cloudinary.js";
import Project from "../../models/project/project.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const createProject = asyncHandler(async (req, res, next) => {
  const imageGallary = req.files; // [{}, {}]
  let imageGallaryResponse = null;

  if (imageGallary) {
    imageGallaryResponse = await uploadFileToCloudinary(
      imageGallary,
      "Project"
    );
  }

  const project = await Project.create({
    user: req.user._id,
    ...req.body,
    areaRange: req.body.areaRange && JSON.parse(req.body.areaRange),
    priceRange: req.body.priceRange && JSON.parse(req.body.priceRange),
    availability: req.body.availability && JSON.parse(req.body.availability),
    aminities: req.body.aminities && JSON.parse(req.body.aminities),
    bankOfApproval:
      req.body.bankOfApproval && JSON.parse(req.body.bankOfApproval),
    imageGallary: (imageGallaryResponse && imageGallaryResponse[0]) || null,
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
