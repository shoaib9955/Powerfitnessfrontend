import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { body, validationResult } from "express-validator";

import Member from "../models/memberModel.js";
import History from "../models/historyModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendEmail } from "../utils/mailer.js";
import { generateStyledReceiptPDF } from "../utils/pdfGenerator.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

// Validators
const memberValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("email").optional().isEmail().withMessage("Invalid email"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

// Helper: calculate expiry date
const calcExpiry = (duration) => {
  const d = new Date();
  if (duration === "1 Month") d.setMonth(d.getMonth() + 1);
  else if (duration === "3 Months") d.setMonth(d.getMonth() + 3);
  else if (duration === "6 Months") d.setMonth(d.getMonth() + 6);
  else if (duration === "1 Year") d.setFullYear(d.getFullYear() + 1);
  return { expiryDate: d, expiryDateString: d.toDateString() };
};

// ---------------- ROUTES ----------------

// Add Member// routes/memberRoutes.js

router.post(
  "/",
  authMiddleware,
  upload.single("avatar"),
  memberValidators,
  handleValidation,
  async (req, res) => {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

      const {
        name,
        phone,
        email,
        sex = "Male",
        duration = "1 Month",
        amountPaid = 0,
        due = 0,
      } = req.body;
      const { expiryDate, expiryDateString } = calcExpiry(duration);

      const member = await Member.create({
        name,
        phone,
        email,
        sex,
        duration,
        amountPaid: Number(amountPaid),
        due: Number(due),
        avatar: req.file?.filename || null,
        expiryDate,
        expiryDateString,
        createdBy: req.user._id,
      });

      await History.create({
        memberId: member._id,
        action: "Created",
        details: member.toObject(),
        performedBy: req.user._id,
      });

      // Respond immediately to client
      res.status(201).json(member);

      // Generate PDF and send email in background
      if (email) {
        generateStyledReceiptPDF(member)
          .then((buffer) =>
            sendEmail({
              to: email,
              subject: "🏋️ PowerFitness Payment Receipt",
              html: `<p>Hello ${name}, your receipt is attached.</p>`,
              attachments: [
                { filename: `receipt-${member._id}.pdf`, content: buffer },
              ],
            })
          )
          .then(() => console.log(`Receipt sent to ${email}`))
          .catch((err) => console.error("EMAIL ERROR (background):", err));
      }
    } catch (err) {
      console.error("ADD MEMBER ERROR:", err);
      res
        .status(500)
        .json({ message: "Failed to add member", error: err.message });
    }
  }
);

// Get all members
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });
    const members = await Member.find().sort({ createdAt: -1 }).lean();
    res.json(members);
  } catch (err) {
    console.error("GET MEMBERS ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch members", error: err.message });
  }
});
// GET single member
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Only admin or creator can view
    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== String(member.createdBy)
    )
      return res.status(403).json({ message: "Forbidden" });

    res.json(member);
  } catch (err) {
    console.error("GET MEMBER ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch member", error: err.message });
  }
});
// ---------------- SEND RECEIPT ----------------
router.post("/:id/send-receipt", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });
    if (!member.email)
      return res.status(400).json({ message: "No email for this member" });

    const pdfBuffer = await generateStyledReceiptPDF(member);

    await sendEmail({
      to: member.email,
      subject: "🏋️ PowerFitness Payment Receipt",
      html: `<p>Hello ${member.name}, your receipt is attached.</p>`,
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
// DELETE member
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const member = await Member.findById(req.params.id); // ⚠️ Do NOT use .lean()
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Save snapshot in history
    await History.create({
      memberId: member._id,
      action: "Deleted",
      details: member.toObject(),
      performedBy: req.user._id,
    });

    // Delete member from DB
    await Member.deleteOne({ _id: member._id }); // safer alternative to .remove()

    res.json({ message: "Member deleted successfully", memberId: member._id });
  } catch (err) {
    console.error("DELETE MEMBER ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to delete member", error: err.message });
  }
});
// UPDATE member
// PUT /api/members/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Ensure req.body exists
    const body = req.body || {};

    // Destructure safely
    const { name, phone, email, sex, duration, amountPaid, due } = body;

    // Update fields only if provided
    if (name !== undefined) member.name = name;
    if (phone !== undefined) member.phone = phone;
    if (email !== undefined) member.email = email;
    if (sex !== undefined) member.sex = sex;
    if (duration !== undefined) member.duration = duration;
    if (amountPaid !== undefined) member.amountPaid = Number(amountPaid);
    if (due !== undefined) member.due = Number(due);

    const updatedMember = await member.save();

    await History.create({
      memberId: updatedMember._id,
      action: "Updated",
      details: updatedMember.toObject(),
      performedBy: req.user._id,
    });

    res.json(updatedMember);
  } catch (err) {
    console.error("UPDATE MEMBER ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to update member", error: err.message });
  }
});

// Send receipt separately

export default router;
