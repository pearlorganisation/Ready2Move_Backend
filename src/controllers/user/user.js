import OTP from "../../models/otp/otp.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { sendPasswordResetOTPOnMail } from "../../utils/mail/emailTemplate.js";
import { generateOTP } from "../../utils/otpUtils.js";
import { paginate } from "../../utils/pagination.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, roles } = req.query; // /api/v1/users?roles=AGENT,BUILDER

  let filter = {
    _id: { $ne: req.user._id }, // Exclude the current user.
  };

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

export const getUserData = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const data = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!data) {
      return next(new ApiError("Unable to find the user", 404));
    }

    res.status(200).json({
      success: true,
      data: data,
      message: "User found successfully",
    });
  } catch (error) {
    next(error); // Let the global error handler handle server errors
  }
});

export const updateUserData = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  if (req.body.email && req.body.email !== user.email) {
    return next(new ApiError("Email cannot be updated", 400));
  }
  // Update user details
  user.name = req.body.name || user.name;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

  if (req.body.password) {
    user.password = req.body.password; // This triggers pre("save") for hashing
  }

  await user.save(); // Save to trigger middleware

  user.password = undefined;
  return res.status(200).json({
    success: true,
    message: "User details updated successfully!",
    user,
  });
});

export const refreshTokenController = asyncHandler(async (req, res, next) => {
  const clientRefreshToken = req.cookies.refresh_token;
  if (!clientRefreshToken) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return next(new ApiError("No refresh token provided", 401));
  }
  try {
    const decoded = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // FIND USER USING THE DECODED._ID
    const user = await User.findById(decoded?._id);
    if (!user || clientRefreshToken !== user?.refreshToken) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return next(new ApiError("Refresh token expired", 401));
    }
    const access_token = user.generateAccessToken();
    const refresh_token = user.generateRefreshToken();

    user.refreshToken = refresh_token;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("access_token", access_token, {
        ...COOKIE_OPTIONS,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      })
      .cookie("refresh_token", refresh_token, {
        ...COOKIE_OPTIONS,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      })
      .json({ status: true, message: "User logged in" });
  } catch (error) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return next(new ApiError("Invalid refresh token", 401));
  }
});
