const History = require('../models/History');

// Get all history records
const getHistories = async (req, res) => {
  try {
    const histories = await History.find().populate('memberId').sort({ createdAt: -1 });
    res.json({ data: histories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete history record
const deleteHistory = async (req, res) => {
  try {
    const history = await History.findByIdAndDelete(req.params.id);
    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }
    res.json({ message: 'History deleted permanently' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHistories,
  deleteHistory,
};
