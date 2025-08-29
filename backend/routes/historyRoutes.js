import express from "express";
import MemberHistory from "../models/historyModel.js";
import Member from "../models/memberModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// GET all history logs
router.get("/", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  try {
    const history = await MemberHistory.find()
      .populate("performedBy", "username role")
      .sort({ createdAt: -1 });
    res.json({ message: "History fetched", data: history });
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err });
  }
});

// DELETE history record
router.delete("/:id", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  try {
    await MemberHistory.findByIdAndDelete(req.params.id);
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

    const { _id, ...rest } = history.details; // remove old _id
    const restored = new Member(rest);
    await restored.save();

    res.json({ message: "Member restored successfully", data: restored });
  } catch (err) {
    res.status(500).json({ message: "Error restoring member", error: err });
  }
});

export default router;
