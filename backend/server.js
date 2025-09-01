import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import memberRoutes from "./routes/memberRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import { sendEmail } from "./utils/mailer.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import winston from "winston";
import createAdmin from "./utils/createAdmin.js";

// -------------------- Env Config --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// -------------------- Logger Setup --------------------
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
    new winston.transports.File({ filename: "server.log" }),
  ],
});

// -------------------- Security & Body Parsers --------------------
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("CORS: Not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT || "500", 10),
});
app.use(limiter);

// -------------------- Routes --------------------
app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/fees", feeRoutes);

// -------------------- Connect to MongoDB --------------------
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: process.env.NODE_ENV !== "production",
  })
  .then(async () => {
    logger.info("✅ MongoDB connected");

    // Ensure admin exists or updated
    await createAdmin();

    // Optional: test email
    if (process.env.NODE_ENV !== "production") {
      sendEmail({
        to: process.env.EMAIL_USER,
        subject: "Gym App Server Started",
        html: "<h3>The Gym App server has started successfully!</h3>",
      }).catch((err) => logger.error("❌ Email error:", err));
    }
  })
  .catch((err) => {
    logger.error("❌ DB connection error:", err);
  });
// -------------------- Local Development Server --------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// -------------------- Export app for Vercel --------------------
export default app;
