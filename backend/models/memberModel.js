import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    duration: { type: mongoose.Schema.Types.Mixed, default: "" }, // can store string or number
    amountPaid: { type: mongoose.Schema.Types.Mixed, default: "" }, // string or number
    due: { type: mongoose.Schema.Types.Mixed, default: "" }, // string or number
    avatar: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
