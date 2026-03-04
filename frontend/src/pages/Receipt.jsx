// src/pages/Receipt.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../api";
import { FaPrint, FaEnvelope, FaChevronLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Receipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const formatDate = (dateString, fallback = "N/A") => {
    if (!dateString) return fallback;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? fallback : date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/members/${id}`);
        const data = res.data.data || res.data;
        setMember(Array.isArray(data) ? data[0] : data); 
      } catch (err) {
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handlePrint = () => window.print();

  const handleSendReceipt = async () => {
    if (!member || !member.email) {
      setMessage({ type: "error", text: "No email available for this member." });
      return;
    }

    setSending(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ Corrected API Path: /receipts/:id/send-receipt
      const res = await api.post(`/receipts/${id}/send-receipt`);
      setMessage({ type: "success", text: res.data.message || "Receipt sent successfully!" });
    } catch (err) {
      console.error("Send receipt error:", err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to send receipt" });
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg-main)]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!member) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)] p-6 text-center">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center mb-6">
        <FaExclamationCircle className="text-rose-500 text-3xl" />
      </div>
      <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">Receipt Not Found</h2>
      <p className="text-[var(--text-secondary)] font-medium mb-8">We couldn't find the payment record for this member.</p>
      <button onClick={() => navigate('/members')} className="premium-button bg-slate-950 dark:bg-indigo-600 text-white px-8 py-3 uppercase text-xs tracking-widest">
        Go to Member List
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-24 pb-16 px-4">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: portrait; margin: 0; }
          html, body { 
            height: 100vh !important; 
            overflow: hidden !important; 
            margin: 0 !important; 
            padding: 0 !important;
            -webkit-print-color-adjust: exact; 
            background: white !important;
            color: black !important;
          }
          .no-print, .print-footer { display: none !important; }
          .print-container { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            padding: 0.5cm !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
          }
          .premium-card { 
            margin: 0 !important; 
            border: 1px solid #f1f5f9 !important;
            box-shadow: none !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
          }
          .text-\[var\(--text-primary\)\] { color: black !important; }
          .text-\[var\(--text-secondary\)\] { color: #64748b !important; }
          .border-\[var\(--border-color\)\] { border-color: #f1f5f9 !important; }
          .bg-\[var\(--bg-main\)\], .bg-slate-50 { background-color: white !important; }
        }
      `}} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto print-container"
      >
        <div className="premium-card overflow-hidden mt-8">
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <img src={logo} alt="PowerFitness" className="w-14 h-14 object-contain mb-3 dark:invert" />
              <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase">Payment Receipt</h1>
              <div className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black tracking-widest uppercase mt-1">
                PowerFitness Elite Gym
              </div>
            </div>

            {/* Member Info */}
            <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-[var(--border-color)]">
              <div className="space-y-3">
                <DetailRow label="Member Name" value={member.name} highlight />
                <DetailRow label="Phone" value={member.phone} />
                <DetailRow label="Plan" value={`${member.duration} Month(s)`} />
              </div>
              <div className="space-y-3 text-right">
                <DetailRow label="Receipt ID" value={member._id?.slice(-8).toUpperCase()} right />
                <DetailRow label="Date" value={formatDate(member.createdAt)} right />
                <DetailRow label="Status" value={member.due > 0 ? "Pending" : "Paid"} 
                  color={member.due > 0 ? "text-rose-600" : "text-emerald-600"} right />
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-secondary)] font-medium">Membership Fee</span>
                  <span className="text-[var(--text-primary)]">₹ {Number(member.amountPaid || 0) + Number(member.due || 0)}.00</span>
                </div>
                {member.due > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[var(--text-secondary)] font-medium">Balance Due</span>
                    <span className="text-rose-500">₹ {member.due}.00</span>
                  </div>
                )}
                <div className="h-px bg-[var(--border-color)] my-3" />
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-0.5">Total Paid</span>
                    <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">₹ {member.amountPaid}.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-0.5">Valid Until</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{formatDate(member.expiryDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-[var(--border-color)] print-footer">
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest leading-relaxed">
                Thank you for choosing PowerFitness. <br />
                Generated on {new Date().toLocaleDateString()}.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4 no-print">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Back
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-slate-950 dark:bg-slate-800 text-white rounded-2xl hover:bg-black dark:hover:bg-slate-700 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            <FaPrint className="inline mr-2" /> Print Receipt
          </button>
          <button 
            onClick={handleSendReceipt}
            disabled={sending}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              sending ? 'bg-indigo-300' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none'
            }`}
          >
            <FaEnvelope className="inline mr-2" /> {sending ? "Sending..." : "Email Receipt"}
          </button>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-4 rounded-xl text-center text-xs font-black uppercase tracking-widest border ${
                message.type === "success" 
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50" 
                  : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/50"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const DetailRow = ({ label, value, highlight, color, right }) => (
  <div className={right ? "text-right" : ""}>
    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-1">{label}</span>
    <span className={`${highlight ? "text-lg font-black text-[var(--text-primary)]" : "text-sm font-bold text-[var(--text-primary)] opacity-80"} ${color || ""}`}>
      {value || "N/A"}
    </span>
  </div>
);

export default Receipt;
