import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (!to) throw new Error("No recipient email provided");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Gym Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });

  console.log(`✅ Email sent to ${to}`);
  return info;
};
