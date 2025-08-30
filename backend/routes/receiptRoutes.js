import express from "express";
import Member from "../models/memberModel.js";
import { generateStyledReceiptPDF } from "../utils/pdfGenerator.js";
import { sendEmail } from "../utils/mailer.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------- SEND RECEIPT EMAIL -----------------
router.post("/:id/send-receipt", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });
    if (!member.email)
      return res.status(400).json({ message: "No email for this member" });

    // Generate PDF (matching frontend)
    const pdfBuffer = await generateStyledReceiptPDF(member);

    // Send email with PDF attachment
    await sendEmail({
      to: member.email,
      subject: "🏋️ PowerFitness Payment Receipt",
      html: `<h3>Hello ${member.name},</h3>
             <p>Thank you for joining PowerFitness! Please find your receipt attached.</p>`,
      attachments: [
        { filename: `receipt-${member._id}.pdf`, content: pdfBuffer },
      ],
    });

    res.json({ message: "Receipt sent successfully!" });
  } catch (err) {
    console.error("SEND RECEIPT ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to send receipt", error: err.message });
  }
});

export default router;
