import express from "express";
import Fee from "../models/feeModel.js";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// -------------------- GET ALL FEES (Public) --------------------
router.get("/", async (req, res) => {
  try {
    const fees = await Fee.find();
    res.json({ success: true, data: fees });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- CREATE FEE (Admin only) --------------------
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    body("planName").notEmpty().withMessage("Plan name is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { planName, amount, description, offer } = req.body;
      const fee = new Fee({ planName, amount, description, offer });
      await fee.save();
      res.status(201).json({ success: true, data: fee });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// -------------------- UPDATE FEE (Admin only) --------------------
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { planName, amount, description, offer } = req.body;

      const fee = await Fee.findByIdAndUpdate(
        req.params.id,
        { planName, amount, description, offer },
        { new: true, runValidators: true }
      );

      if (!fee)
        return res
          .status(404)
          .json({ success: false, message: "Fee not found" });

      res.json({ success: true, data: fee });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// -------------------- DELETE FEE (Admin only) --------------------
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee)
      return res.status(404).json({ success: false, message: "Fee not found" });

    res.json({ success: true, message: "Fee deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
