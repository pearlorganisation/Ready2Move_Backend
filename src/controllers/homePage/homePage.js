import { uploadFileToCloudinary } from "../../config/cloudinary";
import { asyncHandler } from "../../utils/error/asyncHandler";

// Create Homepage Section
export const createHomepage = asyncHandler(async (req, res, next) => {
  const backgroundImage = req.file;
  let backgroundImageResponse = null;

  if (backgroundImage) {
    backgroundImageResponse = await uploadFileToCloudinary(
      backgroundImage,
      "Homepage"
    );
  }

  const homepage = await Homepage.create({
    ...req.body,
    backgroundImage:
      (backgroundImageResponse && backgroundImageResponse[0]) || null,
  });

  if (!homepage) {
    return next(new ApiError("Failed to create homepage section", 400));
  }

  return res
    .status(201)
    .json(new ApiResponse("Created homepage section successfully", homepage));
});

// Get All Homepage Sections
export const getAllHomepages = asyncHandler(async (req, res) => {
  const homepages = await Homepage.find();

  return res
    .status(200)
    .json(
      new ApiResponse("Fetched all homepage sections successfully", homepages)
    );
});

// Get Single Homepage Section by ID
export const getHomepageById = asyncHandler(async (req, res, next) => {
  const homepage = await Homepage.findById(req.params.id);

  if (!homepage) {
    return next(new ApiError("Homepage section not found", 404));
  }

  return res
    .status(200)
    .json(new ApiResponse("Fetched homepage section successfully", homepage));
});

// Update Homepage Section
export const updateHomepage = asyncHandler(async (req, res, next) => {
  let backgroundImageResponse = null;

  if (req.file) {
    backgroundImageResponse = await uploadFileToCloudinary(
      req.file,
      "Homepage"
    );
  }

  const updatedData = {
    ...req.body,
    backgroundImage: backgroundImageResponse
      ? backgroundImageResponse[0]
      : undefined, // Update only if a new image is provided
  };

  const homepage = await Homepage.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!homepage) {
    return next(new ApiError("Homepage section not found", 404));
  }

  return res
    .status(200)
    .json(new ApiResponse("Updated homepage section successfully", homepage));
});

// Delete Homepage Section
export const deleteHomepage = asyncHandler(async (req, res, next) => {
  const homepage = await Homepage.findByIdAndDelete(req.params.id);

  if (!homepage) {
    return next(new ApiError("Homepage section not found", 404));
  }

  return res
    .status(200)
    .json(new ApiResponse("Deleted homepage section successfully", null));
});
