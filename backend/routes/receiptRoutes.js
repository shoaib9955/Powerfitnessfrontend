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
      return res
        .status(400)
        .json({ success: false, message: "Invalid member ID" });
    }

    const member = await Member.findById(id).lean();
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    if (!member.email) {
      return res.status(400).json({
        success: false,
        message: "This member has no registered email",
      });
    }

    // Generate PDF (matches frontend)
    const pdfBuffer = await generateStyledReceiptPDF(member);

    // Send email with PDF attachment
    await sendEmail({
      to: member.email,
      subject: "🏋️ PowerFitness Payment Receipt",
      html: `
        <h3>Hello ${member.name},</h3>
        <p>Thank you for joining <strong>PowerFitness</strong>!</p>
        <p>Please find your receipt attached below.</p>
        <p>Stay fit, <br/> The PowerFitness Team 💪</p>
      `,
      attachments: [
        { filename: `receipt-${member._id}.pdf`, content: pdfBuffer },
      ],
    });

    res.json({ success: true, message: "Receipt sent successfully!" });
  } catch (err) {
    console.error("SEND RECEIPT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send receipt",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;
