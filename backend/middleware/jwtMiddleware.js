import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // only if you want full user

export const verifyToken = async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({ message: "Server misconfiguration: JWT_SECRET missing" });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Option A: Just attach decoded payload
    // req.user = decoded;

    // ✅ Option B (recommended): Fetch full user from DB
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
