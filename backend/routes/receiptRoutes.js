import express from "express";
import mongoose from "mongoose";
import Member from "../models/memberModel.js";

import { sendEmail } from "../utils/mailer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import generateStyledReceiptPDF from "../utils/pdfGenerator.js";

const router = express.Router();

// ---------------- SEND RECEIPT EMAIL -----------------
router.post("/:id/send-receipt", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid member ID" });
    }

    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });

    if (!member.email) {
      return res.status(400).json({ success: false, message: "Member does not have an email address" });
    }

    // Generate PDF buffer
    const pdfBuffer = await generateStyledReceiptPDF(member);

    // Fetch Admin Details to get custom emailForReceipts
    const admin = await mongoose.model("User").findById(req.user.id);
    const customEmail = admin?.emailForReceipts || process.env.EMAIL_USER;

    // Email options
    const emailOptions = {
      to: member.email,
      fromEmail: customEmail,
      replyToEmail: customEmail,
      subject: `Payment Receipt - ${member.name} - PowerFitness`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">PowerFitness Gym</h2>
          <p>Dear <strong>${member.name}</strong>,</p>
          <p>Thank you for your payment. Please find your attached receipt below.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Receipt_${member.name.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    await sendEmail(emailOptions);

    res.json({ success: true, message: "Receipt sent successfully to " + member.email });
  } catch (err) {
    console.error("❌ Send receipt error:", err);
    res.status(500).json({ success: false, message: "Failed to send receipt: " + err.message });
  }
});

export default router;
