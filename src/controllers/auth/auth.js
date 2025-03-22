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
  const otp = generateOTP();
  try {
    if (existingUser) {
      if (existingUser.isVerified) {
        return next(new ApiError("User already exists!", 400));
      }

      await sendRegistrationOTPOnMail(email, { name, otp });
      await OTP.findOneAndReplace(
        { email, type: "REGISTER" },
        { otp, email, type: "REGISTER" },
        { upsert: true, new: true } // upsert: Creates a new document if no match is found., new: returns updated doc
      );

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully. Please verify your email.",
      });
    }
    // Create new user and send OTP
    await sendRegistrationOTPOnMail(email, { name, otp });
    await OTP.create({
      otp,
      email,
      type: "REGISTER",
    });
    await User.create({ ...req?.body, isVerified: false }); // thsi will through error if user creation fails
    res.status(201).json({
      success: true,
      message: "OTP sent successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error Sending OTP:", error);
    return next(new ApiError(`Failed to send OTP: ${error.message}`, 400));
  }
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp, type } = req?.body;
  if (!email || !otp || !type) {
    return next(new ApiError("Email , Otp, and type are required!", 400));
  }
  const otpDoc = await OTP.findOne({ email, otp, type });
  if (!otpDoc) return next(new ApiError("OTP is expired", 400));

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  );
  if (!user) return next(new ApiError("User not found", 400));

  await OTP.deleteOne({ email, otp, type });
  res.status(200).json({
    success: true,
    message: "OTP verified. User registered successfully.",
  });
});

export const resendOTP = asyncHandler(async (req, res, next) => {
  const { email, type } = req?.body;

  if (!email || !type) {
    return next(new ApiError("Email and type are required!", 400));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  const otp = generateOTP();

  try {
    await sendRegistrationOTPOnMail(email, { name: user.name, otp });

    // Replacing the old OTP document with a new one (to reset TTL)
    await OTP.findOneAndReplace(
      { email, type },
      { otp, email, type },
      { upsert: true, new: true } // upsert: Creates a new document if no match is found., new: returns updated doc
    );

    res.status(200).json({
      success: true,
      message: "OTP resent successfully. Please verify your email.",
    });
  } catch (error) {
    console.log("ERROR Sending mail: ", error);
    return next(new ApiError(`Failed to send OTP: ${error.message}`, 400));
  }
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

export const logout = asyncHandler(async (req, res, next) => {
  res
    .clearCookie("access_token", COOKIE_OPTIONS)
    .status(200)
    .json({ success: true, message: "Logout Successfull" });
});
