import { SMTPClient } from "emailjs";
import "dotenv/config";

// Reusable client (only used in production)
let client;

// Always try to create client if credentials exist
const createClient = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return new SMTPClient({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      ssl: process.env.EMAIL_SECURE === "true" || true,
    });
  }
  return null;
};

client = createClient();

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
export const sendEmail = async ({ to, subject, html, attachments = [], fromEmail, replyToEmail }) => {
  try {
    // Always log preview in dev
    if (process.env.NODE_ENV !== "production") {
      console.log("\n================ EMAIL PREVIEW ================");
      console.log("📩 To:", to);
      console.log("📌 Subject:", subject);
      if (attachments.length > 0) {
        console.log("📎 Attachments:", attachments.map((a) => a.filename).join(", "));
      }
      if (fromEmail) console.log("📤 From (Custom):", fromEmail);
      console.log("===============================================\n");
    }

    if (!client) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Email credentials missing in production");
      }
      console.log("⚠️ No SMTP credentials found. Email not sent, preview only.");
      return true;
    }

    // Attempt real send
    const defaultFrom = `"PowerFitness" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`;
    const from = fromEmail ? `"PowerFitness" <${fromEmail}>` : defaultFrom;

    await client.sendAsync({
      text: "Please view this email in an HTML-compatible client.", // plain text fallback
      from,
      replyTo: replyToEmail || undefined,
      to,
      subject,
      attachment: [
        { data: html, alternative: true },

        ...attachments.map((a) => ({
          data: a.content, // Use buffer directly if provided
          name: a.filename,
          type: a.contentType || "application/pdf"
        })),
      ],
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
