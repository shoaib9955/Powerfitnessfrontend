import mongoose from "mongoose";

const memberHistorySchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" }, // link to original member
    action: {
      type: String,
      enum: ["Created", "Updated", "Deleted", "Restored"], // added Restored + capitalized
      required: true,
    },
    details: { type: Object, required: true }, // snapshot of member data
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who performed the action
  },
  { timestamps: true }
);

export default mongoose.model("History", memberHistorySchema);
