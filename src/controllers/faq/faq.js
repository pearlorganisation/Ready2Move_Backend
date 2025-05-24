import Faq from "../../models/faq/faq.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const createFaq = asyncHandler(async (req, res) => {
  const newFaq = await Faq.create(req.body);
  if (!newFaq) {
    return next(new ApiError("Failed to create the Faq", 400));
  }
  res.status(201).json({
    success: true,
    message: "FAQ created successfully",
    data: newFaq,
  });
});

export const getAllFaqs = asyncHandler(async (req, res, next) => {
  const faqs = await Faq.find();
  if (!faqs || faqs.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No FAQs found",
      data: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "All FAQs fetched successfully",
    data: faqs,
  });
});

// UPDATE FAQ
export const updateFaq = asyncHandler(async (req, res, next) => {
  const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedFaq) {
    return next(new ApiError("Failed to update FAQ", 400));
  }
  res.status(200).json({
    success: true,
    message: "FAQ updated successfully",
    data: updatedFaq,
  });
});

// DELETE FAQ
export const deleteFaq = asyncHandler(async (req, res, next) => {
  const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
  if (!deletedFaq) {
    return next(new ApiError("Failed to delete FAQ", 400));
  }
  res.status(200).json({
    success: true,
    message: "FAQ deleted successfully",
  });
});
