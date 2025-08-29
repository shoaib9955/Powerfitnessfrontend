import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { body, validationResult } from "express-validator";

import Member from "../models/memberModel.js";
import History from "../models/historyModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendEmail } from "../utils/mailer.js";

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

// Helper: calculate expiry
const calcExpiry = (duration) => {
  const d = new Date();
  if (duration === "1 Month") d.setMonth(d.getMonth() + 1);
  else if (duration === "3 Months") d.setMonth(d.getMonth() + 3);
  else if (duration === "6 Months") d.setMonth(d.getMonth() + 6);
  else if (duration === "1 Year") d.setFullYear(d.getFullYear() + 1);
  return { expiryDate: d, expiryDateString: d.toDateString() };
};

// Helper: generate PDF in-memory
const generateReceiptPDFBuffer = (member) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text("🏋️ Gym Membership Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Name: ${member.name}`);
      doc.text(`Phone: ${member.phone}`);
      if (member.email) doc.text(`Email: ${member.email}`);
      doc.text(`Sex: ${member.sex}`);
      doc.text(`Duration: ${member.duration}`);
      doc.text(`Amount Paid: ₹${Number(member.amountPaid || 0)}`);
      doc.text(`Due: ₹${Number(member.due || 0)}`);
      doc.text(`Expiry Date: ${member.expiryDateString}`);
      doc.text(
        `Created At: ${new Date(member.createdAt).toLocaleDateString()}`
      );
      doc.text(`Status: ${Number(member.due || 0) > 0 ? "Pending" : "Paid"}`);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });

// Validation rules
const memberValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("email").optional().isEmail().withMessage("Invalid email"),
];

// Handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

/* ----------------------- ADD MEMBER ----------------------- */
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

      // --- LOG HISTORY ---
      await History.create({
        memberId: member._id,
        action: "Created",
        details: member.toObject(),
        performedBy: req.user._id,
      });

      res.status(201).json(member);

      if (email) {
        generateReceiptPDFBuffer(member)
          .then((buffer) =>
            sendEmail({
              to: email,
              subject: "Your Gym Membership Receipt",
              html: `<h3>Hello ${name},</h3><p>Thank you for joining our gym. Your receipt is attached.</p>`,
              attachments: [{ filename: "receipt.pdf", content: buffer }],
            })
          )
          .catch((err) => console.error("Async email error:", err));
      }
    } catch (err) {
      console.error("ADD MEMBER ERROR:", err);
      res
        .status(500)
        .json({ message: "Failed to add member", error: err.message });
    }
  }
);

/* ----------------------- GET ALL MEMBERS ----------------------- */
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

/* ----------------------- GET SINGLE MEMBER ----------------------- */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

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

/* ----------------------- UPDATE MEMBER ----------------------- */
router.put(
  "/:id",
  authMiddleware,
  upload.single("avatar"),
  memberValidators,
  handleValidation,
  async (req, res) => {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

      const member = await Member.findById(req.params.id);
      if (!member) return res.status(404).json({ message: "Member not found" });

      // --- LOG HISTORY BEFORE UPDATE ---
      await History.create({
        memberId: member._id,
        action: "Updated",
        details: member.toObject(),
        performedBy: req.user._id,
      });

      const update = { ...req.body };
      if (update.amountPaid !== undefined)
        update.amountPaid = Number(update.amountPaid) || 0;
      if (update.due !== undefined) update.due = Number(update.due) || 0;

      if (update.duration) {
        const { expiryDate, expiryDateString } = calcExpiry(update.duration);
        update.expiryDate = expiryDate;
        update.expiryDateString = expiryDateString;
      }

      if (req.file) {
        if (member.avatar)
          fs.unlink(path.join(uploadsDir, member.avatar), () => {});
        update.avatar = req.file.filename;
      }

      const updatedMember = await Member.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
      );

      res.json(updatedMember);
    } catch (err) {
      console.error("UPDATE MEMBER ERROR:", err);
      res
        .status(500)
        .json({ message: "Failed to update member", error: err.message });
    }
  }
);

/* ----------------------- DELETE MEMBER ----------------------- */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // --- LOG HISTORY BEFORE DELETE ---
    await History.create({
      memberId: member._id,
      action: "Deleted",
      details: member.toObject(),
      performedBy: req.user._id,
    });

    if (member.avatar)
      fs.unlink(path.join(uploadsDir, member.avatar), () => {});

    await Member.findByIdAndDelete(member._id);

    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error("DELETE MEMBER ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to delete member", error: err.message });
  }
});

/* ----------------------- RESTORE MEMBER ----------------------- */
router.post("/restore/:historyId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const historyEntry = await History.findById(req.params.historyId);
    if (!historyEntry)
      return res.status(404).json({ message: "History not found" });

    const restoredData = { ...historyEntry.details };
    delete restoredData._id; // <- remove old _id to avoid duplicate

    const restoredMember = await Member.create({
      ...restoredData,
      createdBy: req.user._id,
    });

    await History.create({
      memberId: restoredMember._id,
      action: "Restored",
      details: restoredMember.toObject(),
      performedBy: req.user._id,
    });

    res.json({
      message: "Member restored successfully",
      member: restoredMember,
    });
  } catch (err) {
    console.error("RESTORE MEMBER FROM HISTORY ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to restore member", error: err.message });
  }
});

export default router;
