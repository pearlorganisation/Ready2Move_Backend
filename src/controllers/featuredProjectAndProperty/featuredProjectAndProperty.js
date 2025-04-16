import Project from "../../models/project/project.js";
import Property from "../../models/property/property.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const getAllFeaturedProjectsAndProperties = asyncHandler(
  async (req, res, next) => {
    const [featuredProjects, featuredProperties] = await Promise.all([
      Project.find({ isFeatured: true }), // Send only required data. and need to populate some fields for both
      Property.find({ isFeatured: true }),
    ]);

    const message =
      !featuredProjects.length && !featuredProperties.length
        ? "No featured projects or properties found"
        : "Featured Projects and Properties fetched successfully";

    res.status(200).json({
      success: true,
      message,
      data: {
        featuredProjects,
        featuredProperties,
      },
    });
  }
);
