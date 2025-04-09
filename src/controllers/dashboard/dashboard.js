import Lead from "../../models/lead/leads.js";
import Project from "../../models/project/project.js";
import Property from "../../models/property/property.js";
import User from "../../models/user/user.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const getDashboardMetrics = asyncHandler(async (req, res, next) => {
  const [totalUsers, totalLeads, totalProjects, totalProperties, recentLeads] =
    await Promise.all([
      User.countDocuments(),
      Lead.countDocuments(),
      Project.countDocuments(),
      Property.countDocuments(),
      Lead.find()
        .populate({ path: "property", select: "title service property" })
        .populate({ path: "project", select: "title service projectType" })
        .populate({ path: "assignedTo", select: "name role" })
        .sort({ createdAt: -1 })
        .limit(5), // Fetch only required fields
    ]);
  return res.status(200).json({
    success: true,
    message: "Fetched Dashboard Metrics successfully",
    data: {
      totalUsers,
      totalLeads,
      totalProjects,
      totalProperties,
      recentLeads,
    },
  });
});
