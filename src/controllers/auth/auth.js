import OTP from "../../models/otp/otp.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { sendRegistrationOTPOnMail } from "../../utils/mail/emailTemplate.js";
import { generateOTP } from "../../utils/otpUtils.js";
import { COOKIE_OPTIONS } from "../../../constants.js";

export const register = asyncHandler(async (req, res, next) => {
  const { email, name } = req?.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ApiError("User already exists!", 400));

  const otp = generateOTP();

  // Send OTP to user's email
  try {
    await sendRegistrationOTPOnMail(email, { name, otp });
    const otpDoc = await OTP.create({
      otp,
      email,
      type: "REGISTER",
    });
  } catch (error) {
    console.log("ERROR Sending mail: ", error);
    return next(new ApiError(`Failed to send OTP: ${error.message}`, 400)); // enhance error handling
  }

  const user = await User.create({
    ...req?.body,
    isVerified: false,
  });

  if (!user) {
    return next(new ApiError("User is not created", 400));
  }

  res.status(201).json({
    success: true,
    message: "OTP sent successfully. Please verify your email.",
  });
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req?.body;
  const otpDoc = await OTP.findOne({ email, otp, type: "REGISTER" });
  if (!otpDoc) return next(new ApiError("OTP is expired", 400));

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  );
  if (!user) return next(new ApiError("User not found", 400));

  await OTP.deleteOne({ email, otp, type: "REGISTER" });
  res.status(200).json({
    success: true,
    message: "OTP verified. User registered successfully.",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    return next(new ApiError("All fields are required", 400));
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ApiError("User not found", 400));

  // Check if the user is verified (if necessary)
  if (!existingUser.isVerified) {
    return next(
      new ApiError("Please verify your email before logging in.", 403)
    );
  }

  const isValidPassword = await existingUser.isPasswordCorrect(password);

  if (!isValidPassword) {
    return next(new ApiError("Wrong password", 400));
  }

  const access_token = existingUser.generateAccessToken();

  // Convert Mongoose document to plain object
  const sanitizedUser = existingUser.toObject();
  sanitizedUser.password = undefined;
  sanitizedUser.createdAt = undefined;
  sanitizedUser.updatedAt = undefined;
  sanitizedUser.__v = undefined;

  res
    .cookie("access_token", access_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(new Date().setMonth(new Date().getMonth() + 2)), // Expires in 2 months
    })
    .status(200)
    .json({
      success: true,
      message: "Login Successfull",
      user: sanitizedUser,
    });
});
