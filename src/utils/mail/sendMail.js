import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Define the sendMail function
export const sendMail = async (to, subject, templateName, data) => {
  const __fileName = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__fileName);
  const templatePath = path.join(
    __dirname,
    "../../../views/mails",
    `${templateName}.ejs`
  );

  // Render the email template
  const html = await ejs.renderFile(templatePath, data);

  // Configure the email transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or use another email service (e.g., Outlook, AWS SES)
    auth: {
      user: process.env.NODEMAILER_EMAIL_USER,
      pass: process.env.NODEMAILER_EMAIL_PASS,
    },
  });
  // Email options
  const mailOptions = {
    from: `R2M <${process.env.NODEMAILER_EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return new Promise((resolve, reject) => {
    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      } else {
        return resolve("Email Sent Successfully: " + info.response);
      }
    });
  });
};
