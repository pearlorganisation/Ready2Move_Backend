import { generatePagesArray } from "./generatePagesArray.js";

export const paginate = async (
  model,
  page = 1,
  limit = 5,
  filter = {}, // Optional filter parameter
  populateOptions = [],
  fields = "",
  sortField = { createdAt: -1 }
) => {
  const skip = (page - 1) * limit;

  // Count total documents based on the filter
  const totalDocuments = await model.countDocuments(filter);

  // Fetch paginated data with filtering and optional population
  let query = model.find(filter).skip(skip).limit(limit).sort(sortField);

  // Apply field selection if provided
  if (fields) {
    const selectedFields = fields.split(",").join(" "); // Convert comma-separated to space-separated
    query = query.select(selectedFields);
  }

  if (populateOptions.length > 0) {
    populateOptions.forEach((option) => {
      query = query.populate(option);
    });
  }
  const data = await query;

  // Calculate total pages and create pages array
  const totalPages = Math.ceil(totalDocuments / limit);
  const pagesArray = generatePagesArray(totalPages, page);

  // buildPaginationObject({});

  // Build pagination object
  const pagination = {
    total: totalDocuments,
    current_page: page,
    limit,
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    pages: pagesArray,
  };

  return { data, pagination };
};
