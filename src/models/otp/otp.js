import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: [true, "Otp is a required field"],
  },
  type: {
    type: String,
    default: "REGISTER",
    enum: ["REGISTER", "FORGOT_PASSWORD"],
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "10m" }, // TTL index for automatic deletion
  },
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
