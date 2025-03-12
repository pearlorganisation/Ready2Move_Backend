export const DB_NAME = "R2M_DB";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV !== "development",
};

export const USER_ROLES_ENUM = {
  USER: "USER",
  AGENT: "AGENT",
  BUILDER: "BUILDER",
};

export const AVAILABLE_USER_ROLES = Object.values(USER_ROLES_ENUM);
