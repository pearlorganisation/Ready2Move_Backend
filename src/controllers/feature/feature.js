import { buildFeaturePipeline } from "../../helpers/aggregationPipelines.js";
import Feature from "../../models/feature/feature.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { generatePagesArray } from "../../utils/generatePagesArray.js";

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

export const getAllFeatures = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, type, paging } = req.query;
  const isPaging = paging === "true"; // By default paging is false

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const filter = {
    ...(type && { type }), // { ...false } does nothing, so filter remains {}.
  };

  const pipeline = buildFeaturePipeline(filter, pageNum, limitNum, isPaging);
  const features = await Feature.aggregate(pipeline);
  if (!features || features.length === 0) {
    return next(new ApiError("No Features found", 404));
  }

  const totalDocuments = await Feature.countDocuments(filter);
  const totalPages = Math.ceil(totalDocuments / limit);
  const pagesArray = generatePagesArray(totalPages, pageNum);
  if (isPaging) {
    // Pagination info
    const paginationInfo = {
      total: totalDocuments,
      current_page: pageNum,
      limit: limitNum,
      next: pageNum < totalPages ? pageNum + 1 : null,
      prev: pageNum > 1 ? pageNum - 1 : null,
      pages: pagesArray,
    };
    return res.status(200).json({
      success: true,
      message: "Fetched all Features successfully",
      paginationInfo,
      data: features,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Fetched all Features successfully",
    data: features,
  });
});

export const updateFeatureById = asyncHandler(async (req, res, next) => {
  const { name, type } = req.body;

  const feature = await Feature.findByIdAndUpdate(
    req.params.id,
    { name, type },
    { new: true, runValidators: true }
  );

  if (!feature) {
    return next(new ApiError("Failed to update the Feature", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Updated the Feature successfully",
    data: feature,
  });
});

export const deleteFeatureById = asyncHandler(async (req, res, next) => {
  const feature = await Feature.findByIdAndDelete(req.params.id);

  if (!feature) {
    return next(new ApiError("Feature not found", 404));
  }

  return res
    .status(200)
    .json({ success: true, message: "Deleted the Feature successfully" });
});
