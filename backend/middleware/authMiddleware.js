import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET not set in environment variables");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  // Extract token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found or unauthorized" });
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin Role Middleware
export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Flexible Role Middleware
export const roleMiddleware =
  (roles = []) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };

export default authMiddleware;
