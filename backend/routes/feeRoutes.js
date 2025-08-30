import express from "express";
import Fee from "../models/feeModel.js";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/fees → all users
router.get("/", async (req, res) => {
  try {
    const fees = await Fee.find();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/fees → admin only
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { planName, amount, description, offer } = req.body;
    const fee = new Fee({ planName, amount, description, offer });
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/fees/:id → admin only
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    const { planName, amount, description, offer } = req.body;
    fee.planName = planName ?? fee.planName;
    fee.amount = amount ?? fee.amount;
    fee.description = description ?? fee.description;
    fee.offer = offer ?? fee.offer;

    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/fees/:id → admin only
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    await fee.deleteOne();
    res.json({ message: "Fee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
