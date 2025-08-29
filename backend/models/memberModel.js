import mongoose from "mongoose";

const memberSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    sex: { type: String, default: "Male" },
    duration: { type: String, default: "1 Month" },
    amountPaid: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
    avatar: { type: String },
    expiryDate: { type: Date },
    expiryDateString: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);
export default Member;
