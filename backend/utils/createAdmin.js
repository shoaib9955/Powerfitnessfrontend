// utils/createAdmin.js
import User from "../models/userModel.js";

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      username: process.env.ADMIN_USERNAME,
    });

    const adminData = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    };

    if (existingAdmin) {
      // Do NOT overwrite password on restart. This allows admin to keep custom Settings passwords.
      return;
    }

    const admin = new User(adminData);
    await admin.save();
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

export default createAdmin;
