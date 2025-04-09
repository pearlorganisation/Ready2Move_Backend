import { sendMail } from "./sendMail.js";

export const sendRegistrationOTPOnMail = async (email, data) => {
  const subject = "User Registration OTP";
  const templateName = "sendOtp";
  return sendMail(email, subject, templateName, data);
};

export const sendPasswordResetOTPOnMail = async (email, data) => {
  const subject = "Password Reset OTP";
  const templateName = "forgot-password-otp";
  return sendMail(email, subject, templateName, data);
};

// export const sendPasswordResetSuccessMail = async (email, data) => {
//   const subject = "Password Reset Successful";
//   const templateName = "passwordResetSuccess";
//   return sendMail(email, subject, templateName, data);
// };
