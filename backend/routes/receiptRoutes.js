import express from "express";
import Member from "../models/memberModel.js";
import PDFDocument from "pdfkit";
import { sendEmail } from "../utils/mailer.js"; // use your mailer utility
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate PDF buffer helper
async function generateReceiptPDF(member) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text("🏋️ Gym Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${member.name}`);
      doc.text(`Phone: ${member.phone}`);
      doc.text(`Email: ${member.email}`);
      doc.text(`Duration: ${member.duration}`);
      doc.text(`Amount Paid: ₹${member.amountPaid}`);
      doc.text(`Due: ₹${member.due}`);
      doc.text(`Expiry Date: ${member.expiryDateString}`);
      doc.text(`Status: ${member.due > 0 ? "❌ Pending" : "✅ Paid"}`);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ----------------- DOWNLOAD RECEIPT -----------------
router.get("/:id/receipt", authMiddleware, async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    // role-based access: admin or owner
    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== String(member.createdBy)
    )
      return res.status(403).json({ message: "Forbidden" });

    const pdfBuffer = await generateReceiptPDF(member);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${member._id}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

// ----------------- SEND RECEIPT VIA EMAIL -----------------
router.post("/:id/send-receipt", authMiddleware, async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });
    if (!member.email)
      return res.status(400).json({ message: "No email for this member" });

    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    // respond immediately
    res.json({ message: "Receipt will be sent shortly" });

    // async email
    const pdfBuffer = await generateReceiptPDF(member);
    await sendEmail({
      to: member.email,
      subject: "🏋️ Your Gym Receipt",
      html: `<h3>Hello ${member.name},</h3><p>Please find your receipt attached.</p>`,
      attachments: [{ filename: "receipt.pdf", content: pdfBuffer }],
    });
  } catch (err) {
    console.error("SEND RECEIPT ERROR:", err);
  }
});

export default router;
