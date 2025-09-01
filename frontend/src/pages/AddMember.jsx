import React, { useState, useRef } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    sex: "Male",
    duration: "1",
    amountPaid: "",
    due: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [memberCreated, setMemberCreated] = useState(null);
  const [receiptCreated, setReceiptCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (avatar) data.append("avatar", avatar);

    try {
      const res = await api.post("/members", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMemberCreated(res.data.member);
      setReceiptCreated(res.data.receipt);

      // auto send email
      if (res.data.member?._id && res.data.member?.email) {
        await api.post(`/receipts/${res.data.member._id}/send`, {});
      }

      setFormData({
        name: "",
        phone: "",
        email: "",
        sex: "Male",
        duration: "1",
        amountPaid: "",
        due: "",
      });
      setAvatar(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setMessage({
        type: "success",
        text: "✅ Member added, receipt generated & emailed!",
      });
    } catch (err) {
      console.error("AddMember Error:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: "❌ Failed to add member or create receipt.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-24 max-w-lg mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-white to-gray-50 shadow-xl rounded-2xl p-6 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ➕ Add New Member
        </h2>

        {message.text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-4 text-center font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </motion.p>
        )}

        {/* Inputs */}
        <div className="grid gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
          />
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Male">👨 Male</option>
            <option value="Female">👩 Female</option>
          </select>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">1 Year</option>
          </select>
          <input
            type="number"
            name="amountPaid"
            placeholder="Amount Paid (₹)"
            value={formData.amountPaid}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="number"
            name="due"
            placeholder="Due Amount (₹)"
            value={formData.due}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full text-gray-600"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition transform ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02]"
          }`}
        >
          {loading ? "⏳ Adding..." : "✅ Add Member"}
        </button>
      </form>

      {/* Links after success */}
      {memberCreated && receiptCreated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex flex-col gap-3"
        >
          <Link
            to={`/receipt/${memberCreated._id}`}
            className="bg-yellow-400 hover:bg-yellow-500 text-green-800 py-3 px-4 rounded-lg text-center font-medium shadow-md transition"
          >
            📄 View Receipt
          </Link>
          <Link
            to="/members"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium shadow-md transition"
          >
            👥 Go to Member List
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddMember;
