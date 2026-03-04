import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    sex: { type: String, enum: ["Male", "Female"], default: "Male" },
    duration: { type: Number, default: 1 }, // in months
    amountPaid: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    avatar: { type: String, default: null },
    expiryDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
