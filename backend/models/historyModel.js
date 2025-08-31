import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    action: { type: String, enum: ["Created", "Updated", "Deleted"] },
    details: { type: Object }, // full member data snapshot
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("MemberHistory", historySchema);
