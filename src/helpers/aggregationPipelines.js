export const buildFeaturePipeline = (filter, page, limit, paging) => {
  const skip = (page - 1) * limit;
  return [
    { $match: filter }, //  filter = {}, match everything
    {
      $group: {
        _id: "$type",
        features: {
          $push: {
            // "$$ROOT"
            _id: "$_id",
            name: "$name",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id", // assign the value of _id to a new field called type.
        // totalFeatures: { $size: "$features" }, // Get total count of features
        features: paging ? { $slice: ["$features", skip, limit] } : "$features", // Apply pagination only if paging is true
      },
    },
  ];
};

export const buildProjectSearchPipeline = (
  query,
  page,
  limit,
  filters = {}
) => {
  const skip = (page - 1) * limit;
  const { service, projectType } = filters;

  const pipeline = [
    {
      $search: {
        index: "default",
        compound: {
          should: [
            {
              autocomplete: {
                query,
                path: "title",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              autocomplete: {
                query,
                path: "city",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              autocomplete: {
                query,
                path: "locality",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              autocomplete: {
                query,
                path: "state",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              text: {
                query,
                path: ["description", "projectType", "service", "reraNumber"],
              },
            },
          ],
        },
      },
    },
  ];

  // Apply filters if provided
  const matchStage = {};
  if (service) matchStage.service = service.toUpperCase();
  if (projectType) matchStage.projectType = projectType.toUpperCase();

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Optional: add a sort stage if needed
  pipeline.push({
    $sort: { createdAt: -1 }, // Change field if needed
  });

  // Project only title and slug
  pipeline.push({
    $project: {
      title: 1,
      slug: 1,
    },
  });
  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      count: [{ $count: "total" }],
    },
  });

  return pipeline;
};

export const buildPropertySearchPipeline = (
  query,
  page,
  limit,
  filters = {}
) => {
  const skip = (page - 1) * limit;
  const pipeline = [
    {
      $search: {
        index: "default",
        compound: {
          should: [
            {
              autocomplete: {
                query,
                path: "title",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              autocomplete: {
                query,
                path: "city",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              autocomplete: {
                query,
                path: "locality",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              autocomplete: {
                query,
                path: "state",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
            {
              text: {
                query,
                path: ["description", "property", "service", "reraNumber"], // type will be text or string in json mapping
              },
            },
          ],
        },
      },
    },
  ];

  // Apply filters if provided
  if (Object.keys(filters).length > 0) {
    pipeline.push({ $match: filters });
  }

  // Optional: add a sort stage if needed
  pipeline.push({
    $sort: { createdAt: -1 }, // Change field if needed
  });

  // Project only title and slug
  pipeline.push({
    $project: {
      title: 1,
      slug: 1,
    },
  });
  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      count: [{ $count: "total" }],
    },
  });

  return pipeline;
};

// export const buildProjectSearchPipeline = (
//   query,
//   page,
//   limit,
//   filters = {}
// ) => {
//   const skip = (page - 1) * limit;
//   const { service, projectType, minArea, maxArea, minPrice, maxPrice } =
//     filters;

//   const mustConditions = [];

//   if (service) {
//     mustConditions.push({
//       text: {
//         query: service,
//         path: "service",
//       },
//     });
//   }

//   if (projectType) {
//     mustConditions.push({
//       text: {
//         query: projectType,
//         path: "projectType",
//       },
//     });
//   }

//   if (!isNaN(minArea) || !isNaN(maxArea)) {
//     const areaFilter = { range: { path: "areaRange.min" } };
//     if (!isNaN(minArea)) areaFilter.range.gte = minArea;
//     if (!isNaN(maxArea)) areaFilter.range.lte = maxArea;
//     mustConditions.push(areaFilter);
//   }

//   if (!isNaN(minPrice) || !isNaN(maxPrice)) {
//     const priceFilter = { range: { path: "priceRange.min" } };
//     if (!isNaN(minPrice)) priceFilter.range.gte = minPrice;
//     if (!isNaN(maxPrice)) priceFilter.range.lte = maxPrice;
//     mustConditions.push(priceFilter);
//   }

//   const searchStage = {
//     $search: {
//       index: "default",
//       compound: {},
//     },
//   };

//   if (query) {
//     searchStage.$search.compound.should = [
//       {
//         autocomplete: {
//           query,
//           path: "title",
//           fuzzy: { maxEdits: 1 },
//         },
//       },
//       {
//         text: {
//           query,
//           path: [
//             "description",
//             "locality",
//             "city",
//             "state",
//             "service",
//             "projectType",
//             "reraNumber",
//           ],
//         },
//       },
//     ];
//   }

//   if (mustConditions.length > 0) {
//     searchStage.$search.compound.must = mustConditions;
//   }

//   return [
//     searchStage,
//     {
//       $facet: {
//         data: [{ $skip: skip }, { $limit: limit }],
//         count: [{ $count: "total" }],
//       },
//     },
//     { $unwind: "$data" },
//     {
//       $replaceRoot: {
//         newRoot: {
//           $mergeObjects: [
//             "$data",
//             { count: { $arrayElemAt: ["$count.total", 0] } },
//           ],
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: "features",
//         localField: "availability",
//         foreignField: "_id",
//         as: "availability",
//       },
//     },
//     {
//       $unwind: {
//         path: "$availability",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $addFields: {
//         availability: {
//           $cond: {
//             if: { $gt: [{ $type: "$availability" }, "missing"] },
//             then: {
//               _id: "$availability._id",
//               name: "$availability.name",
//               type: "$availability.type",
//             },
//             else: "$availability",
//           },
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: "features",
//         localField: "aminities",
//         foreignField: "_id",
//         as: "aminities",
//       },
//     },
//     {
//       $lookup: {
//         from: "features",
//         localField: "bankOfApproval",
//         foreignField: "_id",
//         as: "bankOfApproval",
//       },
//     },
//     {
//       $addFields: {
//         aminities: {
//           $map: {
//             input: "$aminities",
//             as: "item",
//             in: {
//               _id: "$$item._id",
//               name: "$$item.name",
//               type: "$$item.type",
//             },
//           },
//         },
//         bankOfApproval: {
//           $map: {
//             input: "$bankOfApproval",
//             as: "item",
//             in: {
//               _id: "$$item._id",
//               name: "$$item.name",
//               type: "$$item.type",
//             },
//           },
//         },
//       },
//     },
//     // Remove `count` from each document before grouping
//     {
//       $unset: "count",
//     },
//     {
//       $group: {
//         _id: null,
//         data: { $push: "$$ROOT" },
//         total: { $first: "$count" },
//       },
//     },
//     {
//       $project: {
//         data: 1,
//         total: 1,
//         _id: 0,
//       },
//     },
//   ];
// };
