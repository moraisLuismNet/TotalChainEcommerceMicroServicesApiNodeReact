import dotenv from "dotenv";
dotenv.config();

export const emailConfig = {
  fromEmail: process.env.EMAIL_FROM_EMAIL || "luism.desarrollo@gmail.com",
  fromName: process.env.EMAIL_FROM_NAME || "TotalChainEcommerce",
  brevoApiKey: process.env.EMAIL_BREVO_API_KEY || "",
  adminEmail: process.env.EMAIL_ADMIN_EMAIL || "luism.desarrollo@gmail.com",
};
