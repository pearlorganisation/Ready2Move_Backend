import Project from "../../models/project/project.js";
import Property from "../../models/property/property.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";

export const getCityWithLocality = asyncHandler(async (req, res) => {
  let { limit } = req.query;
  limit = limit ? Number(limit) : undefined;
  const projectQuery = Project.find({}, "city locality").sort({
    createdAt: -1,
  });
  const propertyQuery = Property.find({}, "city locality").sort({
    createdAt: -1,
  });

  if (limit) {
    projectQuery.limit(limit);
    propertyQuery.limit(limit);
  }

  const projectData = await projectQuery.lean();
  const propertyData = await propertyQuery.lean();
  const groupByCity = (data) => {
    const map = {};

    data.forEach(({ city, locality }) => {
      if (!map[city]) {
        map[city] = new Set();
      }
      map[city].add(locality);
    });

    return Object.entries(map).map(([city, localities]) => ({
      city,
      localities: Array.from(localities),
    }));
  };

  const projectCities = groupByCity(projectData);
  const propertyCities = groupByCity(propertyData);

  res.status(200).json({
    success: true,
    message: "Cities and Localities fetched successfully",
    projectsCityWithLocality: projectCities,
    propertiesCityWithLocality: propertyCities,
  });
});
