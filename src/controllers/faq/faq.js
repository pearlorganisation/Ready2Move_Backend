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
