import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import memberRoutes from "./routes/memberRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import { sendEmail } from "./utils/mailer.js";
import User from "./models/userModel.js";
import bcrypt from "bcrypt";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Static folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);

// -------------------- Admin creation --------------------
async function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn("⚠️ ADMIN_USERNAME or ADMIN_PASSWORD not set in .env");
    return;
  }

  const existingAdmin = await User.findOne({ username });
  if (existingAdmin) {
    console.log("⚠️ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({ username, password: hashedPassword, role: "admin" });
  await admin.save();
  console.log("✅ Admin created successfully");
}

// -------------------- Connect to MongoDB --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Create admin if not exists
    await ensureAdmin();

    // Test email (optional)
    sendEmail({
      to: process.env.EMAIL_USER,
      subject: "Gym App Server Started",
      html: "<h3>The Gym App server has started successfully!</h3>",
    }).catch((err) => console.error("❌ Email error:", err));

    // Start server
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
