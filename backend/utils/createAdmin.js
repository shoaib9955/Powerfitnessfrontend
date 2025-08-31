// utils/createAdmin.js
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      username: process.env.ADMIN_USERNAME,
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new User({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

export default createAdmin;
