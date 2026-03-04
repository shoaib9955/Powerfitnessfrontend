const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  offer: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
