import User from "../models/user/user.js";
import ApiError from "../utils/error/ApiError.js";
import { asyncHandler } from "../utils/error/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError("Unauthorized user", 401));
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    return next(new ApiError("Invalid access token!", 401));
  }
  req.user = user;
  next();
});

//Optional Authentication: For routes where authentication is not mandatory. For routes that must work for both logged-in and logged-out users. [main use is that logged out user also get access to the route without authentication, for logged in user we can show ui changes for votes ]
export const optionalAuthenticateToken = asyncHandler(
  async (req, res, next) => {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      // No token provided, proceed as an unauthenticated user
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        // Invalid user associated with the token
        req.user = null;
        return next();
      }

      // Valid token and user found
      req.user = user;
      next();
    } catch (err) {
      // Token verification failed, proceed as an unauthenticated user
      req.user = null;
      next();
    }
  }
);

export const verifyPermission = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user?._id) {
      return next(new ApiError("Unauthorized request", 401));
    }
    if (roles.includes(req.user?.role)) {
      next();
    } else {
      return next(new ApiError("Access denied", 403));
    }
  });
