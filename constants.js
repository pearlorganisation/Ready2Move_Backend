export const DB_NAME = "R2M_DB";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
  secure: process.env.NODE_ENV !== "development",
};

export const USER_ROLES_ENUM = {
  USER: "USER",
  AGENT: "AGENT",
  BUILDER: "BUILDER",
  ADMIN: "ADMIN",
};

export const AVAILABLE_USER_ROLES = Object.values(USER_ROLES_ENUM);

// Total 12 feature type
export const featureTypes = [
  "PROPERTY_TYPE",
  "PARKING",
  "FURNISHING",
  "ENTRANCE_FACING",
  "AVAILABILITY",
  "PROPERTY_AGE",
  "OWNERSHIP",
  "AMENITIES",
  "WATER_SOURCE",
  "OTHER_FEATURES",
  "FLOORING",
  "BANKS",
];
