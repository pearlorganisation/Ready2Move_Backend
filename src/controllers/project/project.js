import { uploadFileToCloudinary } from "../../config/cloudinary.js";
import Project from "../../models/project/project.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const createProject = asyncHandler(async (req, res, next) => {
  console.log("requested body is", req.body);

  // Get uploaded images
  const imageGallary = req.files;
  let imageGallaryResponse = null;

  if (imageGallary) {
    imageGallaryResponse = await uploadFileToCloudinary(imageGallary, "Project");
  }

  console.log("the image response is", imageGallaryResponse)

  const project = await Project.create({
    user: req.body.user,
    title: req.body.title,
    slug: req.body.slug,
    subTitle: req.body.subTitle,
    description: req.body.description,
    locality: req.body.locality,
    city: req.body.city,
    state: req.body.state,
    service: req.body.service,
    projectType: req.body.projectType,
    reraPossessionDate: req.body.reraPossessionDate,
    reraNumber:req.body.reraNumber,
    'areaRange.min': req.body.areaRange.min, // ✅ Safe parsing
    'areaRange.max': req.body.areaRange.max, // ✅ Safe parsing
    'priceRange.min':req.body.priceRange.min, // ✅ Safe parsing
    'priceRange.max': req.body.priceRange.max, // ✅ Safe parsing
    availability: req.body.availability,
    aminities: req.body.aminities,
    pricePerSqFt:req.body.pricePerSqFt,
    bankOfApproval: req.body.bankOfApproval,
    imageGallary:imageGallaryResponse,
    youtubeLink:req.body.youtubeLink
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
