import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import History from "../models/historyModel.js";
import Member from "../models/memberModel.js";

const router = express.Router();

// --- Admin only ---
router.use(authMiddleware);

// GET all history
router.get("/", async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const histories = await History.find()
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(histories);
  } catch (err) {
    console.error("GET HISTORY ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch history", error: err.message });
  }
});

// DELETE history entry permanently
router.delete("/delete/:id", async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    await History.findByIdAndDelete(req.params.id);
    res.json({ message: "History entry deleted permanently" });
  } catch (err) {
    console.error("DELETE HISTORY ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to delete history", error: err.message });
  }
});

// RESTORE member from history (optional if using separately)
router.post("/restore/:id", async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const historyEntry = await History.findById(req.params.id);
    if (!historyEntry)
      return res.status(404).json({ message: "History not found" });

    const restoredMember = await Member.create({
      ...historyEntry.details,
      createdBy: req.user._id,
    });

    await History.create({
      memberId: restoredMember._id,
      action: "Restored",
      details: restoredMember,
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
