export const DB_NAME = "R2M_DB";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  secure: process.env.NODE_ENV !== "development",
};

export const USER_ROLES_ENUM = {
  USER: "USER",
  AGENT: "AGENT",
  BUILDER: "BUILDER",
};

export const AVAILABLE_USER_ROLES = Object.values(USER_ROLES_ENUM);

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
