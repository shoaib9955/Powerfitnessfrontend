// src/pages/Receipt.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../api"; // ✅ use the axios instance

const Receipt = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/api/members/${id}`);
        setMember(res.data);
      } catch (err) {
        console.error(
          "Error fetching member:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handlePrint = () => window.print();

  const handleSendReceipt = async () => {
    if (!member || !member.email) {
      setMessage("No email available for this member.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const res = await api.post(`/members/${id}/send-receipt`);
      setMessage(res.data.message || "Receipt sent successfully!");
    } catch (err) {
      console.error("Send receipt error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Failed to send receipt");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-xl">Loading receipt...</p>;
  if (!member)
    return (
      <p className="text-center mt-20 text-red-600 text-xl">
        ❌ Receipt not found
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white print:bg-white rounded-3xl shadow-xl border print:border print:shadow-none">
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
      </div>

      <h2 className="text-3xl font-bold text-center mb-2 print:text-3xl">
        🧾 Payment Receipt
      </h2>
      <p className="text-center text-gray-600 mb-6 print:text-base">
        Thank you for choosing <strong>PowerFitness</strong>!
      </p>

      <div className="space-y-3 border border-gray-200 rounded-xl p-5 print:border print:p-5">
        <div className="flex justify-between">
          <span className="font-semibold">Name:</span>
          <span>{member.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Phone:</span>
          <span>{member.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{member.email || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Sex:</span>
          <span>{member.sex}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Duration:</span>
          <span>{member.duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Amount Paid:</span>
          <span>₹ {member.amountPaid || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Due:</span>
          <span className={member.due > 0 ? "text-red-600" : "text-green-600"}>
            ₹ {member.due || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Joined:</span>
          <span>{new Date(member.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Expiry:</span>
          <span>{new Date(member.expiryDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Status:</span>
          <span
            className={
              member.due > 0
                ? "text-red-600 font-bold"
                : "text-green-600 font-bold"
            }
          >
            {member.due > 0 ? "Pending" : "Paid"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col md:flex-row justify-center gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full font-semibold transition-transform hover:scale-105"
        >
          🖨️ Print
        </button>

        <button
          onClick={handleSendReceipt}
          disabled={sending}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-semibold transition-transform hover:scale-105 disabled:opacity-50"
        >
          {sending ? "Sending..." : "📧 Send Receipt"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default Receipt;
