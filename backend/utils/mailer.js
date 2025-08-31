import nodemailer from "nodemailer";

// Reusable transporter (only used in production)
let transporter;

if (process.env.NODE_ENV === "production") {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
    secure: process.env.EMAIL_SECURE === "true" || true, // true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send Email Utility
 * Works differently in development vs production
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Subject line
 * @param {string} options.html - HTML body
 * @param {Array} [options.attachments] - Attachments
 */
export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      // 🚀 DEV MODE: log email instead of sending
      console.log("\n================ EMAIL PREVIEW ================");
      console.log("📩 To:", to);
      console.log("📌 Subject:", subject);
      console.log("📝 HTML:", html);
      if (attachments.length > 0) {
        console.log(
          "📎 Attachments:",
          attachments.map((a) => a.filename).join(", ")
        );
      }
      console.log("===============================================\n");
      return true;
    }

    // 🌍 PRODUCTION: send via SMTP
    await transporter.sendMail({
      from: `"PowerFitness" <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log(`✅ Email sent to: ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Email sending error:", err);

    if (process.env.NODE_ENV === "production") {
      throw new Error("Email service is currently unavailable");
    } else {
      throw err;
    }
  }
};
