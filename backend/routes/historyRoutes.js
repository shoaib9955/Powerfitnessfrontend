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

// -------------------- RESTORE MEMBER FROM HISTORY --------------------
// -------------------- RESTORE MEMBER FROM HISTORY --------------------
// -------------------- RESTORE MEMBER FROM HISTORY --------------------
router.post("/restore/:id", async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Forbidden" });

  try {
    const history = await MemberHistory.findById(req.params.id);
    if (!history)
      return res
        .status(404)
        .json({ success: false, message: "History not found" });

    if (history.action !== "Deleted") {
      return res.status(400).json({
        success: false,
        message: "Only deleted members can be restored",
      });
    }

    const { _id, ...rest } = history.details;

    // Prevent duplicate restore (by email/phone)
    const existing = await Member.findOne({
      $or: [{ email: rest.email }, { phone: rest.phone }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Member with same email/phone already exists",
      });
    }

    // Only take primitive fields for restore
    const restoredData = {
      name: rest.name || "",
      email: rest.email || "",
      phone: rest.phone || "",
      sex: rest.sex || "Male",
      duration: rest.duration || "1",
      amountPaid: rest.amountPaid || 0,
      due: rest.due || 0,
      // add any other primitive fields you need
    };

    const restored = new Member(restoredData);
    await restored.save();

    // Log restore with flat details
    await MemberHistory.create({
      memberId: restored._id,
      action: "Restored",
      details: restoredData,
      performedBy: req.user._id,
    });

    res.json({
      success: true,
      message: "Member restored successfully",
      member: restored,
    });
  } catch (err) {
    console.error("Error restoring member:", err);
    res.status(500).json({ success: false, message: "Error restoring member" });
  }
});

export default router;
