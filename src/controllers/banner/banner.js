import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import Banner from "../../models/banner/banner.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const createBanner = asyncHandler(async (req, res, next) => {
  const bgImage = req.file;
  let bgImageResponse = null;

  if (bgImage) {
    bgImageResponse = await uploadFileToCloudinary(bgImage, "Banner");
  }

  const banner = await Banner.create({
    ...req.body,
    bgImage: (bgImageResponse && bgImageResponse[0]) || null,
  });

  if (!banner) {
    return next(new ApiError("Failed to create banner", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Banner created successfully.",
    data: banner,
  });
});

export const getAllBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.find();
  if (!banner) {
    return next(new ApiError("Banner not found.", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Fetched all banner successfully",
    data: banner,
  });
});

export const updateBannerById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bgImage = req.file;
  console.log("Request Body:", req.body);
  console.log("Request file:", req.file);
  const existingBanner = await Banner.findById(id);
  if (!existingBanner) {
    return next(new ApiError("Banner not found", 404));
  }

  let bgImageResponse = null;

  if (bgImage) {
    bgImageResponse = await uploadFileToCloudinary(bgImage, "Banner");
    if (existingBanner.bgImage) {
      await deleteFileFromCloudinary(existingBanner.bgImage);
    }
  }

  const bannerData = {
    ...req.body,
    bgImage: bgImageResponse ? bgImageResponse[0] : undefined, // can't use null here as it set null in db if not required
  };

  const updatedBanner = await Banner.findByIdAndUpdate(id, bannerData, {
    new: true,
    runValidators: true,
  });
  console.log(updatedBanner);

  if (!updatedBanner) {
    return next(new ApiError("Banner not found or update failed", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Banner updated successfully",
    data: updatedBanner,
  });
});

export const deleteBannerbyId = asyncHandler(async (req, res, next) => {
  const deletedBanner = await Banner.findByIdAndDelete(req.params.id);

  if (!deletedBanner) {
    return next(new ApiError("Banner not found", 404));
  }

  // Delete images from Cloudinary
  if (deletedBanner?.bgImage)
    await deleteFileFromCloudinary(deletedBanner.bgImage);

  return res
    .status(200)
    .json({ success: true, message: "Banner deleted successfully" });
});
