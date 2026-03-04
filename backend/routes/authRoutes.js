// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/userModel.js";
import rateLimit from "express-rate-limit";
import winston from "winston";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------ Winston Logger ------------------
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "login-errors.log",
      level: "error",
    }),
  ],
});

// ------------------ Rate Limiter ------------------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 attempts per 15 minutes
  message: "Too many login attempts, please try again later.",
});

// ------------------ Register Route ------------------
router.post(
  "/register",
  [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars"),
    body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        password: hashedPassword,
        role: role || "user",
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      logger.error(`Register error: ${err.message}`);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------------------ Login Route ------------------
router.post(
  "/login",
  loginLimiter,
  [
    body("username").isString().notEmpty().withMessage("Username is required."),
    body("password").isString().notEmpty().withMessage("Password is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        logger.warn(`Failed login attempt: ${username} does not exist`);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`Failed login attempt: Incorrect password for ${username}`);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        token,
        role: user.role,
        user: { id: user._id, username: user.username, role: user.role },
      });
    } catch (err) {
      logger.error(`Login error for ${username}: ${err.message}`);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ------------------ Profile (protected) ------------------
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Settings (protected update) ------------------
router.put("/settings", authMiddleware, async (req, res) => {
  try {
    const { username, currentPassword, newPassword, emailForReceipts } = req.body;
    
    // Find absolute user (need password field)
    // authMiddleware sets req.user to exclude password, so we must query again explicitly requesting it
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate current password to authorize changes
    if (!currentPassword) {
       return res.status(400).json({ message: "Current password is required to save changes" });
    }
    
    // Check if user has a password set (some oauth users might not, though not applicable here)
    if (!user.password) {
       return res.status(400).json({ message: "User password not found in database" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
       return res.status(401).json({ message: "Incorrect current password" });
    }

    // Update Username
    if (username && username !== user.username) {
       const exists = await User.findOne({ username });
       if (exists) return res.status(400).json({ message: "Username already taken" });
       user.username = username;
    }

    // Update Email
    if (emailForReceipts !== undefined) {
       user.emailForReceipts = emailForReceipts;
    }

    // Update Password
    if (newPassword && newPassword.length >= 6) {
       // Do not hash here, the userModel.js pre("save") hook will hash it
       user.password = newPassword;
    }

    await user.save();
    
    // Issue a new token in case the username changed
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Settings updated successfully", token, username: user.username });
  } catch (err) {
    logger.error(`Settings update error: ${err.message}`);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------ Refresh Token ------------------
router.post("/refresh", authMiddleware, (req, res) => {
  try {
    const newToken = jwt.sign(
      { id: req.user.id, username: req.user.username, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token: newToken });
  } catch (err) {
    res.status(500).json({ message: "Error generating new token" });
  }
});

export default router;
