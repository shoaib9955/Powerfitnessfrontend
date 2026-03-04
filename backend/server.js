// backend/server.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
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

const app = express();

// -------------------- Logger Setup --------------------
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

// -------------------- Security & Body Parsers --------------------
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// -------------------- Rate Limiting --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT || "500", 10),
});
app.use(limiter);

// -------------------- CORS --------------------
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:5174",
  "https://powerfitness13.onrender.com", // default or previous deployed frontend
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(","));
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      // For Vercel deployments where the preview URL changes, you may want to return true for any origin,
      // but restricting is safer. Returning true dynamically for vercel domains:
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      callback(new Error(`CORS: Not allowed - ${origin}`));
    },
    credentials: true, // allow cookies or auth headers
  }),
);

// -------------------- API Routes --------------------
app.use("/members", memberRoutes);
app.use("/auth", authRoutes);
app.use("/receipts", receiptRoutes);
app.use("/history", historyRoutes);
app.use("/fees", feeRoutes);

// -------------------- Serve Frontend (if built together) --------------------
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
    if (err) {
      res.status(404).send("API is running. Frontend is deployed separately.");
    }
  });
});

// -------------------- MongoDB Connection --------------------
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: process.env.NODE_ENV !== "production",
  })
  .then(async () => {
    logger.info("✅ MongoDB connected");

    await createAdmin();

    if (process.env.NODE_ENV !== "production") {
      sendEmail({
        to: process.env.EMAIL_USER,
        subject: "Gym App Server Started",
        html: "<h3>The Gym App server has started successfully!</h3>",
      }).catch((err) => logger.error("❌ Email error:", err));
    }
  })
  .catch((err) => logger.error("❌ DB connection error:", err));

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  logger.info(`🚀 Server running on http://localhost:${PORT}`),
);
