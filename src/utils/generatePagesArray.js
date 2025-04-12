export const generatePagesArray = (totalPages, currentPage) => {
  let pagesArray = [1];

  if (totalPages > 3) {
    if (currentPage > 2) pagesArray.push(currentPage - 1);
    pagesArray.push(currentPage);
    if (currentPage < totalPages - 1) pagesArray.push(currentPage + 1);
    if (!pagesArray.includes(totalPages)) pagesArray.push(totalPages);
  } else {
    for (let i = 2; i <= totalPages; i++) {
      pagesArray.push(i);
    }
  }

  return [...new Set(pagesArray)].sort((a, b) => a - b);
};
