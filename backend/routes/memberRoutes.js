import express from "express";
import Member from "../models/memberModel.js";
import MemberHistory from "../models/historyModel.js";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ---------------------- FILE UPLOAD ---------------------- //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/members";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files allowed"), false);
    cb(null, true);
  },
});

// ---------------------- VALIDATION ---------------------- //
const validateMember = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").optional().isEmail().withMessage("Valid email required"),
  body("phone").notEmpty().withMessage("Phone is required"),
];

// ---------------------- ROUTES ---------------------- //

// GET all members
router.get("/", authMiddleware, async (req, res) => {
  try {
    const members = await Member.find().populate("createdBy", "username role");
    const plainMembers = members.map((m) => ({
      _id: m._id,
      name: m.name,
      email: m.email || "",
      phone: m.phone,
      sex: m.sex,
      duration: m.duration,
      amountPaid: m.amountPaid,
      due: m.due,
      avatar: m.avatar || null,
    }));
    res.json({ success: true, data: plainMembers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE member
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("avatar"),
  validateMember,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const memberData = {
        ...req.body,
        avatar: req.file ? `/uploads/members/${req.file.filename}` : null,
        createdBy: req.user._id,
      };
      const member = new Member(memberData);
      await member.save();

      // History
      await MemberHistory.create({
        memberId: member._id,
        action: "Created",
        details: member.toObject(),
        performedBy: req.user._id,
      });

      // Return plain object
      res.status(201).json({
        success: true,
        member: {
          _id: member._id,
          name: member.name,
          email: member.email || "",
          phone: member.phone,
          sex: member.sex,
          duration: member.duration,
          amountPaid: member.amountPaid,
          due: member.due,
          avatar: member.avatar || null,
        },
      });
    } catch (err) {
      console.error("❌ Add member error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// UPDATE member
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      if (!member)
        return res
          .status(404)
          .json({ success: false, message: "Member not found" });

      const updateFields = [
        "name",
        "email",
        "phone",
        "duration",
        "amountPaid",
        "due",
        "sex",
      ];
      updateFields.forEach((key) => {
        if (
          req.body[key] !== undefined &&
          req.body[key] !== null &&
          req.body[key] !== ""
        )
          member[key] = req.body[key];
      });

      if (req.file) member.avatar = `/uploads/members/${req.file.filename}`;

      await member.save();

      // History snapshot
      await MemberHistory.create({
        memberId: member._id,
        action: "Updated",
        details: member.toObject(),
        performedBy: req.user._id,
      });

      res.json({
        success: true,
        member: {
          _id: member._id,
          name: member.name,
          email: member.email || "",
          phone: member.phone,
          sex: member.sex,
          duration: member.duration,
          amountPaid: member.amountPaid,
          due: member.due,
          avatar: member.avatar || null,
        },
      });
    } catch (err) {
      console.error("Update error:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to update member" });
    }
  }
);

// DELETE member permanently
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      await MemberHistory.create({
        memberId: member._id,
        action: "Deleted",
        details: member.toObject(),
        performedBy: req.user._id,
      });
      await member.deleteOne();
      return res.json({ success: true, message: "Member deleted permanently" });
    }

    const history = await MemberHistory.findById(req.params.id);
    if (!history)
      return res
        .status(404)
        .json({ success: false, message: "Member or history not found" });

    if (!["Deleted", "Updated", "Created"].includes(history.action))
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete this history record" });

    await history.deleteOne();
    res.json({ success: true, message: "History entry removed permanently" });
  } catch (err) {
    console.error("Delete error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete member/history" });
  }
});

// RESTORE member from deleted snapshot
router.post(
  "/restore/:historyId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const history = await MemberHistory.findById(req.params.historyId);
      if (!history) {
        return res
          .status(404)
          .json({ success: false, message: "History not found" });
      }

      if (history.action !== "Deleted") {
        return res.status(400).json({
          success: false,
          message: "Only deleted members can be restored",
        });
      }

      if (!history.details || !history.details.name) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid history snapshot" });
      }

      const details = history.details.toObject
        ? history.details.toObject()
        : { ...history.details };

      delete details._id;
      delete details.__v;
      delete details.createdAt;
      delete details.updatedAt;

      const query = [];
      if (details.email) query.push({ email: details.email });
      if (details.phone) query.push({ phone: details.phone });

      if (query.length > 0) {
        const existing = await Member.findOne({ $or: query });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Member with same email/phone already exists",
          });
        }
      }

      const restored = new Member(details);
      await restored.save();

      await MemberHistory.create({
        memberId: restored._id,
        action: "Restored",
        details: restored.toObject(),
        performedBy: req.user._id,
      });

      res.json({
        success: true,
        member: {
          _id: restored._id,
          name: restored.name,
          email: restored.email || "",
          phone: restored.phone,
          sex: restored.sex,
          duration: restored.duration,
          amountPaid: restored.amountPaid,
          due: restored.due,
          avatar: restored.avatar || null,
        },
      });
    } catch (err) {
      console.error("❌ Restore error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Error restoring member" });
    }
  }
);

export default router;
