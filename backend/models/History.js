const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    action: {
      type: String,
      default: "Deleted",
    },
    performedBy: {
      username: String,
    },
    details: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("History", historySchema);
