import User from "../../models/user/user.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, roles } = req.query; // /api/v1/users?roles=AGENT,BUILDER

  let filter = {};

  if (roles) {
    const roleArray = roles.split(",").map((role) => role.toUpperCase()); // Convert roles to UPPERCASE
    filter.role = { $in: roleArray };
  }

  const { data: users, pagination } = await paginate(
    User,
    parseInt(page),
    parseInt(limit),
    filter
  );

  if (!users || users.length === 0) {
    return next(new ApiError("No Users found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Fetched all Users successfully",
    pagination,
    data: users,
  });
});
