import Feature from "../../models/feature/feature.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

// Create a Feature
export const createFeature = asyncHandler(async (req, res, next) => {
  const { name, type } = req.body;

  const feature = await Feature.create({ name, type });

  if (!feature) {
    return next(new ApiError("Failed to create the Feature", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Feature created successfully",
    data: feature,
  });
});

// Get all Features
export const getAllFeatures = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, type } = req.query;

  // Convert query parameters to integers where necessary
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const filter = {
    ...(type && { type }),
  };

  const pipeline = await buildFeaturePipeline(filter);

  return res.status(200).json({
    message: "Fetched all Features successfully",
    //     pagination,
    data: features,
  });
});

// Get a single Feature by ID
export const getFeatureById = asyncHandler(async (req, res, next) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    return next(new ApiError("Feature not found", 404));
  }

  return res
    .status(200)
    .json({ message: "Fetched the Feature successfully", data: feature });
});

// Update a Feature by ID
export const updateFeature = asyncHandler(async (req, res, next) => {
  const { name, type } = req.body;

  const feature = await Feature.findByIdAndUpdate(
    req.params.id,
    { name, type },
    { new: true, runValidators: true }
  );

  if (!feature) {
    return next(new ApiError("Failed to update the Feature", 400));
  }

  return res
    .status(200)
    .json({ message: "Updated the Feature successfully", data: feature });
});

// Delete a Feature by ID
export const deleteFeature = asyncHandler(async (req, res, next) => {
  const feature = await Feature.findByIdAndDelete(req.params.id);

  if (!feature) {
    return next(new ApiError("Feature not found", 404));
  }

  return res.status(200).json({ message: "Deleted the Feature successfully" });
});
