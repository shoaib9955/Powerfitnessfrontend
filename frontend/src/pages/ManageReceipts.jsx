// src/pages/ManageReceipts.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { FaReceipt, FaSearch, FaUser, FaEdit, FaPlusCircle, FaTimes, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ManageReceipts = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [editingMember, setEditingMember] = useState(null);
  const [paymentMember, setPaymentMember] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      await api.put(`/members/${editingMember._id}`, editingMember);
      setFeedback({ type: "success", text: "Member updated successfully!" });
      setTimeout(() => {
        setEditingMember(null);
        fetchMembers();
      }, 1500);
    } catch (err) {
      setFeedback({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      // Record payment simply updates the member's billing details
      await api.put(`/members/${paymentMember._id}`, {
        amountPaid: paymentMember.amountPaid,
        due: paymentMember.due,
        duration: paymentMember.duration
      });
      setFeedback({ type: "success", text: "Payment recorded! Receipt updated." });
      setTimeout(() => {
        setPaymentMember(null);
        fetchMembers();
      }, 1500);
    } catch (err) {
      setFeedback({ type: "error", text: "Failed to record payment" });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-8 md:p-25 bg-[var(--bg-main)] pt-64">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 px-4"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-[var(--text-primary)] flex items-center gap-4 tracking-tight">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center">
                <FaReceipt className="text-white text-2xl" />
              </div>
              <span className="font-premium">Manage Billing</span>
            </h1>
            <p className="text-[var(--text-secondary)] font-medium ml-1">Track member payments and send receipts.</p>
          </div>

          <div className="relative w-full md:w-[400px] group">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-xl transition-all group-hover:bg-indigo-500/10" />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-[var(--border-color)] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Ledger...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="premium-card group relative p-8"
              >
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10 group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-900 dark:bg-slate-800 rounded-[1.2rem] flex items-center justify-center shadow-lg dark:shadow-none">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-premium font-black text-xl text-[var(--text-primary)] tracking-tight">{member.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)] font-bold tracking-tight">{member.phone}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingMember(member)}
                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl transition-all"
                  >
                    <FaEdit size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <StatCard label="Membership" value={`${member.duration} mo`} />
                  <StatCard label="Total Paid" value={`₹${member.amountPaid}`} success />
                  <StatCard label="Outstanding" value={`₹${member.due}`} error={member.due > 0} />
                  <StatCard label="Expiry" value={member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : 'N/A'} />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMember(member)}
                    className="premium-button bg-indigo-600 text-white hover:bg-indigo-700 flex-1 premium-gradient"
                  >
                    <FaPlusCircle /> Log Payment
                  </button>
                  <Link
                    to={`/receipt/${member._id}`}
                    className="premium-button bg-slate-950 dark:bg-indigo-950/50 text-white hover:bg-black dark:hover:bg-indigo-900 w-14 !px-0 flex items-center justify-center"
                    title="View Receipt"
                  >
                    <FaReceipt />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMembers.length === 0 && (
          <div className="text-center py-32 premium-card border-dashed border-2 bg-transparent">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-3xl text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] font-premium">No Records Found</h3>
            <p className="text-[var(--text-secondary)] font-medium mt-2">Adjust your filters to locate members.</p>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {editingMember && (
            <Modal title="Edit Profile" onClose={() => setEditingMember(null)}>
              <form onSubmit={handleUpdateMember} className="space-y-6">
                <Input label="Identity Name" value={editingMember.name} onChange={(e) => setEditingMember({...editingMember, name: e.target.value})} required />
                <Input label="Contact Email" type="email" value={editingMember.email} onChange={(e) => setEditingMember({...editingMember, email: e.target.value})} />
                <Input label="Identity Phone" value={editingMember.phone} onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})} required />
                <div>
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3">Gender Specification</label>
                  <select 
                    value={editingMember.sex} 
                    onChange={(e) => setEditingMember({...editingMember, sex: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <StatusMessage feedback={feedback} />
                <SubmitButton loading={actionLoading} label="Synchronize Data" />
              </form>
            </Modal>
          )}

          {paymentMember && (
            <Modal title="Billing Update" onClose={() => setPaymentMember(null)}>
              <form onSubmit={handleRecordPayment} className="space-y-6">
                <div className="bg-indigo-600 p-6 rounded-[2rem] mb-6 flex items-center gap-4 text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <FaReceipt />
                   </div>
                   <div>
                      <h4 className="font-premium font-black text-lg leading-tight uppercase tracking-tight">{paymentMember.name}</h4>
                      <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest mt-1">Manual Ledger Entry</p>
                   </div>
                </div>
                <Input label="Transaction Amount (₹)" type="number" value={paymentMember.amountPaid} onChange={(e) => setPaymentMember({...paymentMember, amountPaid: e.target.value})} required />
                <Input label="Arrears / Due (₹)" type="number" value={paymentMember.due} onChange={(e) => setPaymentMember({...paymentMember, due: e.target.value})} required />
                <div>
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3">Service Extension</label>
                  <select 
                    value={paymentMember.duration} 
                    onChange={(e) => setPaymentMember({...paymentMember, duration: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)]"
                  >
                    <option value="1">Standard (1 Mo)</option>
                    <option value="3">Quarterly (3 Mo)</option>
                    <option value="6">Bi-Annual (6 Mo)</option>
                    <option value="12">Annual (12 Mo)</option>
                  </select>
                </div>
                <StatusMessage feedback={feedback} />
                <SubmitButton loading={actionLoading} label="Register Payment" />
              </form>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, error, success }) => (
  <div className="bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-[var(--border-color)]">
    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-1">{label}</span>
    <span className={`text-sm font-black tracking-tight ${
      error ? 'text-rose-600' : success ? 'text-emerald-600' : 'text-[var(--text-primary)]'
    }`}>{value}</span>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-[var(--bg-surface)] w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative border border-[var(--border-color)]"
    >
      <div className="p-10 flex justify-between items-center border-b border-[var(--border-color)]">
        <h2 className="text-2xl font-premium font-black text-[var(--text-primary)] tracking-tight uppercase leading-none">{title}</h2>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
          <FaTimes />
        </button>
      </div>
      <div className="p-10">{children}</div>
    </motion.div>
  </motion.div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3">{label}</label>
    <input 
      {...props}
      className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)] transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600" 
    />
  </div>
);

const SubmitButton = ({ loading, label }) => (
  <button 
    disabled={loading}
    className={`premium-button w-full py-5 text-xl font-black uppercase tracking-tight shadow-xl ${
      loading ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 shadow-slate-200 dark:shadow-none'
    }`}
  >
    {loading ? "Processing..." : label}
  </button>
);

const StatusMessage = ({ feedback }) => feedback.text ? (
  <div className={`p-5 rounded-2xl text-center font-bold flex items-center justify-center gap-3 border ${
    feedback.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
  }`}>
    {feedback.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
    <span className="text-sm">{feedback.text}</span>
  </div>
) : null;

export default ManageReceipts;
