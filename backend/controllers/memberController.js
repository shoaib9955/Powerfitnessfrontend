const Member = require("../models/Member");
const History = require("../models/History");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Get all members (not deleted)
const getMembers = async (req, res) => {
  try {
    const members = await Member.find({ isDeleted: false });
    res.json({ data: members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single member
const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member || member.isDeleted) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create member
const createMember = async (req, res) => {
  try {
    const { name, phone, email, sex, duration, amountPaid, due } = req.body;
    const avatar = req.file ? req.file.path : null;

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));

    const member = new Member({
      name,
      phone,
      email,
      sex,
      duration: parseInt(duration),
      amountPaid: parseFloat(amountPaid) || 0,
      due: parseFloat(due) || 0,
      avatar,
      expiryDate,
    });

    await member.save();

    // Send receipt email if email provided
    if (email) {
      await sendReceiptEmail(member);
    }

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete member (soft delete)
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Save to history
    await History.create({
      memberId: member._id,
      action: "Deleted",
      performedBy: { username: req.user.email }, // Assuming user has email
      details: member.toObject(),
    });

    member.isDeleted = true;
    await member.save();

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restore member
const restoreMember = async (req, res) => {
  try {
    const history = await History.findById(req.params.historyId);
    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    const restoredMember = new Member(history.data);
    restoredMember.isDeleted = false;
    restoredMember._id = history.memberId; // Restore original ID if needed
    await restoredMember.save();

    await History.findByIdAndDelete(req.params.historyId);

    res.json({ message: "Member restored successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send receipt
const sendReceipt = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member || member.isDeleted) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (!member.email) {
      return res
        .status(400)
        .json({ message: "No email provided for this member" });
    }

    await sendReceiptEmail(member);
    res.json({ message: "Receipt sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to send email
const sendReceiptEmail = async (member) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: member.email,
    subject: "Payment Receipt - PowerFitness",
    html: `
      <h1>Payment Receipt</h1>
      <p>Thank you for choosing PowerFitness!</p>
      <p>Name: ${member.name}</p>
      <p>Phone: ${member.phone}</p>
      <p>Amount Paid: ₹${member.amountPaid}</p>
      <p>Due: ₹${member.due}</p>
      <p>Expiry: ${member.expiryDate.toLocaleDateString()}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  deleteMember,
  restoreMember,
  sendReceipt,
};
