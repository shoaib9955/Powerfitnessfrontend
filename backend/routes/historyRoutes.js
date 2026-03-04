import express from "express";
import MemberHistory from "../models/historyModel.js";
import Member from "../models/memberModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// -------------------- GET HISTORY WITH PAGINATION --------------------
router.get("/", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Forbidden" });

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
      success: true,
      total, // total records
      page, // current page
      totalPages: Math.ceil(total / limit), // total pages
      data: histories, // current page data
    });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ success: false, message: "Error fetching history" });
  }
});

// -------------------- DELETE HISTORY RECORD --------------------
router.delete("/delete/:id", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Forbidden" });

  try {
    const deleted = await MemberHistory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "History not found" });

    res.json({ success: true, message: "History deleted successfully" });
  } catch (err) {
    console.error("Error deleting history:", err);
    res.status(500).json({ success: false, message: "Error deleting history" });
  }
});

export default router;
