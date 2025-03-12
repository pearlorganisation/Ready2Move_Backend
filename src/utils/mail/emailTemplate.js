import { sendMail } from "./sendMail.js";

export const sendRegistrationOTPOnMail = async (email, data) => {
  const subject = "User Registration OTP";
  const templateName = "sendOtp";
  return sendMail(email, subject, templateName, data);
};
