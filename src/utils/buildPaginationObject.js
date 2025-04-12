export const buildPaginationObject = ({
  totalResults,
  page,
  limit,
  totalPages,
  pagesArray,
}) => {
  return {
    total: totalResults,
    current_page: parseInt(page),
    limit: parseInt(limit),
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    pages: pagesArray,
  };
};
