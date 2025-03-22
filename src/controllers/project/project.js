import { uploadFileToCloudinary } from "../../config/cloudinary.js";
import Project from "../../models/project/project.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const createProject = asyncHandler(async (req, res, next) => {
  const imageGallary = req.files;
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
