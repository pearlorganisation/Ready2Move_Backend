import faq from "../../models/faq/faq.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

//  Create a new FAQ
export const createFaq = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;

    // Validate request body
    if (!question || !answer) {
        return res.status(400).json({ status: "error", message: "Question and Answer are required" });
    }

    const newFaq = await faq.create({ question, answer });

    res.status(201).json({
        status: "success",
        message: "FAQ created successfully",
        data: newFaq
    });
});

//  Update an existing FAQ
export const updateFaq = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    // Validate input
    if (!question || !answer) {
        return res.status(400).json({ status: "error", message: "Question and Answer are required" });
    }

    const updatedFaq = await faq.findByIdAndUpdate(id, { question, answer }, { new: true });

    if (!updatedFaq) {
        return res.status(404).json({ status: "error", message: "FAQ not found" });
    }

    res.status(200).json({
        status: "success",
        message: "FAQ updated successfully",
        data: updatedFaq
    });
});

//  Delete an FAQ
export const deleteFaq = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedFaq = await faq.findByIdAndDelete(id);

    if (!deletedFaq) {
        return res.status(404).json({ status: "error", message: "FAQ not found" });
    }

    res.status(200).json({
        status: "success",
        message: "FAQ deleted successfully",
        data: deletedFaq
    });
});

//  Get all FAQs
export const getFaq = asyncHandler(async (req, res) => {
    const faqs = await faq.find();
    res.status(200).json({
        status: "success",
        message: "FAQs retrieved successfully",
        data: faqs
    });
});
