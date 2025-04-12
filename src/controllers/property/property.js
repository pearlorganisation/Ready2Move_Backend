import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../config/cloudinary.js";
import Property from "../../models/property/property.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";
import { safeParse } from "../../utils/safeParse.js";

export const createProperty = asyncHandler(async (req, res, next) => {
  console.log("gjkk",req.body)
  const imageGallery = req.files;
  let imageGalleryResponse = null;
  if (imageGallery) {
    imageGalleryResponse = await uploadFileToCloudinary(
      imageGallery,
      "Property"
    );
  }

  const property = await Property.create({
    user: req.user._id,
    ...req.body,
    area: safeParse(req.body.area),
    bankOfApproval: safeParse(req.body.bankOfApproval),
    aminities: safeParse(req.body.amenities),
    otherFeatures: safeParse(req.body.otherFeatures),
    imageGallery: imageGalleryResponse?.length > 0 ? imageGalleryResponse : [],
  });

  if (!property) {
    return next(new ApiError("Failed to create the Property", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Property created successfully",
    data: property,
  });
});

export const getPropertyBySlug = asyncHandler(async (req, res, next) => {
  const property = await Property.findOne({ slug: req.params?.slug }).populate([
    { path: "user", select: "name email phoneNumber" },
    { path: "propertyType", select: "name type" },
    { path: "parking", select: "name type" },
    { path: "furnishing", select: "name type" },
    { path: "entranceFacing", select: "name type" },
    { path: "availability", select: "name type" },
    { path: "propertyAge", select: "name type" },
    { path: "ownership", select: "name type" },
    { path: "bankOfApproval", select: "name type" },
    { path: "aminities", select: "name type" },
    { path: "waterSource", select: "name type" },
    { path: "otherFeatures", select: "name type" },
    { path: "propertyFlooring", select: "name type" },
  ]);

  if (!property) {
    return next(new ApiError("Property not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Property found successfully",
    data: property,
  });
});

export const getAllProperties = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, priceRange, bedRooms, bathRooms } = req.query;
  const filter = {};
  if (priceRange > 0) {
    filter.expectedPrice = {
      $lte: priceRange,
    };
  }

  if (bedRooms > 0) {
    filter.noOfBedrooms = {
      $lte: bedRooms,
    };
  }

  if (bathRooms > 0) {
    filter.noOfBathrooms = {
      $lte: bathRooms,
    };
  }

  const { data: properties, pagination } = await paginate(
    Property,
    parseInt(page),
    parseInt(limit),
    filter,
    [
      { path: "user", select: "name email phoneNumber" },
      { path: "propertyType", select: "name type" },
      { path: "parking", select: "name type" },
      { path: "furnishing", select: "name type" },
      { path: "entranceFacing", select: "name type" },
      { path: "availability", select: "name type" },
      { path: "propertyAge", select: "name type" },
      { path: "ownership", select: "name type" },
      { path: "bankOfApproval", select: "name type" },
      { path: "aminities", select: "name type" },
      { path: "waterSource", select: "name type" },
      { path: "otherFeatures", select: "name type" },
      { path: "propertyFlooring", select: "name type" },
    ]
  );

  if (!properties || properties.length === 0) {
    return next(new ApiError("No Properties found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "All Properties found successfully",
    pagination,
    data: properties,
  });
});

export const updatePropertyBySlug = asyncHandler(async (req, res, next) => {
  let { deleteImages, ...otherFields } = req.body;
  const imageGallery = req.files;
  let imageGalleryResponse = null;

  const property = await Property.findOne({ slug: req.params?.slug });

  if (!property) {
    return next(new ApiError("Property not found", 404));
  }

  if (!Array.isArray(deleteImages)) {
    deleteImages = deleteImages ? [deleteImages] : [];
  }
  const validDeleteImages = deleteImages.filter((img) => img.trim() !== "");

  if (validDeleteImages.length > 0) {
    for (const image of validDeleteImages) {
      await deleteFileFromCloudinary({ public_id: image });
    }
  }

  if (imageGallery) {
    imageGalleryResponse = await uploadFileToCloudinary(
      imageGallery,
      "Property"
    );
  }

  const bulkOperations = [];

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

  if (imageGalleryResponse?.length > 0) {
    bulkOperations.push({
      updateOne: {
        filter: { slug: req.params?.slug },
        update: { $push: { imageGallery: { $each: imageGalleryResponse } } },
      },
    });
  }

  if (Object.keys(otherFields).length > 0) {
    bulkOperations.push({
      updateOne: {
        filter: { slug: req.params?.slug },
        update: {
          $set: {
            ...otherFields,
            area: othesafeParse(otherFields.area),
            bankOfApproval: safeParse(otherFields.bankOfApproval),
            aminities: safeParse(otherFields.aminities),
            otherFeatures: safeParse(otherFields.otherFeatures),
          },
        },
      },
    });
  }

  if (bulkOperations.length > 0) {
    await Property.bulkWrite(bulkOperations);
  }

  const updatedProperty = await Property.findOne({ slug: req.params?.slug });

  return res.status(200).json({
    success: true,
    message: "Updated the Property successfully",
    data: updatedProperty,
  });
});

export const deletePropertyById = asyncHandler(async (req, res, next) => {
  const property = await Property.findByIdAndDelete(req.params.id);

  if (!property) {
    return next(new ApiError("Property not found", 404));
  }
  if (property?.imageGallery)
    await deleteFileFromCloudinary(property.imageGallery);

  return res
    .status(200)
    .json({ success: true, message: "Deleted the Property successfully" });
});
