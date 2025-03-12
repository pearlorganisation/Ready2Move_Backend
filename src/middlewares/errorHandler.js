import ApiError from "../utils/error/ApiError.js";

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const message = `Validation Error: ${Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")}`;
    err = new ApiError(message, 400);
  }

  // Handle wrong MongoDB ObjectId errors
  if (err.name === "CastError") {
    const message = `Resource not found with this ID. Invalid ${err.path}`;
    err = new ApiError(message, 400);
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const message = `Duplicate key error: ${Object.keys(err.keyValue).join(
      ", "
    )} already exists.`;
    err = new ApiError(message, 400);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    err = new ApiError(message, 401);
  }

  // Handle JWT token expiration
  if (err.name === "TokenExpiredError") {
    const message = "Token expired. Please log in again.";
    err = new ApiError(message, 401);
  }

  // Log the error for debugging (use a logging library in production)
  console.error(err);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
