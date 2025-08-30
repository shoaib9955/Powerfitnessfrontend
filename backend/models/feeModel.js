import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    description: { type: String },
    offer: { type: String },
  },
  { timestamps: true }
);

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;
