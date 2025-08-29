import express from "express";
import MemberHistory from "../models/historyModel.js";
import Member from "../models/memberModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// GET history logs with pagination
router.get("/", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  try {
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = parseInt(req.query.limit) || 20; // default 20 per page
    const skip = (page - 1) * limit;

    const total = await MemberHistory.countDocuments();
    const histories = await MemberHistory.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("performedBy", "username role");

    res.json({
      total, // total records
      page, // current page
      totalPages: Math.ceil(total / limit), // total pages
      histories, // current page data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching history", error: err });
  }
});

// DELETE history record
router.delete("/delete/:id", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  try {
    const deleted = await MemberHistory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "History not found" });
    res.json({ message: "History deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting history", error: err });
  }
});

// RESTORE member from history
router.post("/restore/:id", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  try {
    const history = await MemberHistory.findById(req.params.id);
    if (!history) return res.status(404).json({ message: "History not found" });

    const { _id, ...rest } = history.details;
    const restored = new Member(rest);
    await restored.save();

    res.json({ message: "Member restored successfully", member: restored });
  } catch (err) {
    res.status(500).json({ message: "Error restoring member", error: err });
  }
});

export default router;
