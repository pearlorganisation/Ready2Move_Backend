import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const searchProjects = asyncHandler(async (req, res, next) => {
  const {
    q,
    page = 1,
    limit = 10,
    service,
    projectType,
    minArea,
    maxArea,
    minPrice,
    maxPrice,
  } = req.query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const parsedFilters = {
    service,
    projectType,
    minArea: parseFloat(minArea),
    maxArea: parseFloat(maxArea),
    minPrice: parseFloat(minPrice),
    maxPrice: parseFloat(maxPrice),
  };

  // Determine if any filters or query are provided
  const hasSearchFilters =
    (q ?? "").trim() !== "" ||
    service ||
    projectType ||
    !isNaN(parsedFilters.minArea) ||
    !isNaN(parsedFilters.maxArea) ||
    !isNaN(parsedFilters.minPrice) ||
    !isNaN(parsedFilters.maxPrice);

  let projects = [];
  let totalResults = 0;

  if (hasSearchFilters) {
    const pipeline = buildProjectSearchPipeline(
      q,
      parsedPage,
      parsedLimit,
      parsedFilters
    );
    console.log("Pipeline:", JSON.stringify(pipeline, null, 2));
    console.log("RES: ", await Project.aggregate(pipeline));
    const [result] = await Project.aggregate(pipeline);
    projects = result?.data || [];
    totalResults = result?.total || 0; // result?.count?.[0]?.total
  } else {
    totalResults = await Project.countDocuments();
    projects = await Project.find()
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .populate([
        { path: "availability", select: "name type" },
        { path: "aminities", select: "name type" },
        { path: "bankOfApproval", select: "name type" },
      ]);
  }

  if (projects.length === 0) {
    return next(new ApiError("No Projects found", 404));
  }

  const totalPages = Math.ceil(totalResults / parsedLimit);
  const pagesArray = generatePagesArray(totalPages, parsedPage);

  const pagination = buildPaginationObject({
    totalResults,
    page: parsedPage,
    limit: parsedLimit,
    totalPages,
    pagesArray,
  });

  return res.status(200).json({
    success: true,
    message: "Projects found successfully",
    pagination,
    data: projects,
  });
});
