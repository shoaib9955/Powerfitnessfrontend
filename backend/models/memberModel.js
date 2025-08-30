import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    sex: String,
    duration: String,
    amountPaid: Number,
    due: Number,
    avatar: String,
    expiryDate: Date,
    expiryDateString: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model("Member", memberSchema);
