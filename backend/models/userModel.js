import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Unique already implies an index
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    // Increase salt rounds for more security
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error("Error hashing password:", err.message);
    next(err); // Properly propagate the error
  }
});

// Compare password
userSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.error("Error comparing password:", err.message);
    throw new Error("Password comparison failed");
  }
};

// Removed redundant index definitions
// userSchema.index({ username: 1 }); // Not necessary since 'unique: true' already adds an index
// userSchema.index({ role: 1 }); // Index already implied with the query usage or need for performance

export default mongoose.model("User", userSchema);
