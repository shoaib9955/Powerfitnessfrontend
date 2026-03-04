const Fee = require('../models/Fee');

// Get all fees
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find();
    res.json({ data: fees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create fee
const createFee = async (req, res) => {
  try {
    const { planName, amount, description, offer } = req.body;
    const fee = new Fee({
      planName,
      amount: parseFloat(amount),
      description,
      offer,
    });
    await fee.save();
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update fee
const updateFee = async (req, res) => {
  try {
    const { planName, amount, description, offer } = req.body;
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      {
        planName,
        amount: parseFloat(amount),
        description,
        offer,
      },
      { new: true }
    );
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete fee
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }
    res.json({ message: 'Fee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFees,
  createFee,
  updateFee,
  deleteFee,
};
