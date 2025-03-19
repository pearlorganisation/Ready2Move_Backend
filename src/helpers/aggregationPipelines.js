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
