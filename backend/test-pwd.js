import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import "dotenv/config";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ username: "admin" });
  if (!user) {
    console.log("Admin not found");
    process.exit();
  }
  console.log("DB Username:", user.username);
  console.log("DB Password Hash:", user.password);
  
  const match1 = await bcrypt.compare("shoaib9955", user.password);
  const match2 = await bcrypt.compare("admin123", user.password);
  
  console.log("Matches shoaib9955?", match1);
  console.log("Matches admin123?", match2);
  process.exit();
}
run();
