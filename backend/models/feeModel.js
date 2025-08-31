import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    offer: { type: String, default: "" },
  },
  { timestamps: true }
);

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;
