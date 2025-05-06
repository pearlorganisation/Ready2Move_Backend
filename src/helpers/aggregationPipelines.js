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
      imageGallery: 1,
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
      imageGallery: 1,
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
