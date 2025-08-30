import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or your email host
      port: 465, // 465 for SSL, 587 for TLS
      secure: true, // true for 465
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password (for Gmail)
      },
    });

    await transporter.sendMail({
      from: `"PowerFitness" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Email sending error:", err);
    throw err;
  }
};
