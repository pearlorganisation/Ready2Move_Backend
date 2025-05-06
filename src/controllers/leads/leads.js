import Lead from "../../models/lead/leads.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const createLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.create({
    ...req.body,
    status: "PENDING",
    project: req.body.project || null,
    property: req.body.property || null,
  });

  if (!lead) {
    return next(new ApiError("Failed to create the Lead", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Lead created successfully",
    data: lead,
  });
});

export const getAllLeads = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status, propertyOrProject } = req.query;

  console.log(status, "----", propertyOrProject);
  const filter = {
    ...(status && { status: { $regex: `^${status}$`, $options: "i" } }), //Match an Exact Word (Case-Insensitive)
    ...(propertyOrProject === "project" && {
      project: { $ne: null },
      property: null,
    }),
    ...(propertyOrProject === "property" && {
      property: { $ne: null },
      project: null,
    }),
  };
  const { data: leads, pagination } = await paginate(
    Lead,
    parseInt(page),
    parseInt(limit),
    filter,
    [
      { path: "assignedTo", select: "name role" },
      { path: "property", select: "title service property" },
      { path: "project", select: "title service projectType" },
    ] // Populate assignedTo field with name and email
  );

  if (!leads || leads.lenght === 0) {
    return next(new ApiError("No Leads found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Fetched all Leads successfully",
    pagination,
    data: leads,
  });
});

export const updateLeadById = asyncHandler(async (req, res, next) => {

  const {feedBack,status,assignedTo} = req.body
  const lead = await Lead.findByIdAndUpdate(req.params.id,{
    feedBack,status,assignedTo
  } , {
    new: true,
    runValidators: false,
  });

  if (!lead) {
    return next(new ApiError("Failed to update the Lead", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Updated the Lead successfully",
    data: lead,
  });
});

export const deleteLeadById = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    return next(new ApiError("Lead not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Deleted the Lead successfully",
  });
});
