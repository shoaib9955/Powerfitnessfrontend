import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import api from "../api"; // centralized Axios instance
import { Link, useNavigate } from "react-router-dom";

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    sex: "Male",
    duration: "1", // ✅ send numeric string
    amountPaid: "",
    due: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [memberCreated, setMemberCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

      setMemberCreated(res.data.data || res.data);

      // Reset form
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
        text: `✅ Member added successfully! Receipt emailed.`,
      });
    } catch (err) {
      console.error("AddMember Error:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: "❌ Failed to add member or send email. Check console.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-16 bg-[var(--bg-main)] pt-64">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-10 md:p-16 relative overflow-hidden"
        >
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-bl-[120px] -z-10" />
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 dark:shadow-none">
               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
               </svg>
            </div>
            <h2 className="text-4xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase">Add Member</h2>
            <p className="text-[var(--text-secondary)] font-bold text-xs uppercase tracking-[0.3em] mt-3">Create new member profile</p>
          </div>

          {message.text && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-10 p-5 rounded-2xl text-center font-bold flex items-center justify-center gap-3 border ${
                message.type === "success" 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-rose-50 text-rose-700 border-rose-100"
              }`}
            >
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Input label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                <Input label="Phone Number" name="phone" placeholder="+91 ..." value={formData.phone} onChange={handleChange} required />
                <Input label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 ml-1">Gender</label>
                  <select 
                    name="sex"
                    value={formData.sex} 
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)] transition-all cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3 ml-1">Membership Plan</label>
                  <select 
                    name="duration"
                    value={formData.duration} 
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)] transition-all cursor-pointer"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">1 Year</option>
                  </select>
                </div>
                
                <Input label="Amount Paid (₹)" name="amountPaid" type="number" placeholder="5000" value={formData.amountPaid} onChange={handleChange} />
                <Input label="Balance Due (₹)" name="due" type="number" placeholder="0" value={formData.due} onChange={handleChange} />
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 ml-1">Member Photo</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setAvatar(e.target.files[0])}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload"
                      className="w-full p-4 rounded-2xl border border-dashed border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-[var(--text-secondary)] text-sm"
                    >
                      {avatar ? <span className="text-indigo-600 dark:text-indigo-400">{avatar.name}</span> : <>Upload Photo</>}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="premium-button w-full py-5 bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
            >
              {loading ? "Saving..." : "Save Member"}
            </button>
          </form>

          {memberCreated && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-2 gap-4"
            >
              <Link
                to={`/receipt/${memberCreated._id}`}
                className="premium-button bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-3"
              >
                View Invoice
              </Link>
              <Link
                to="/members"
                className="premium-button bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center gap-3"
              >
                Member Roster
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Input
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3 ml-1">{label}</label>
    <input 
      {...props}
      className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)] transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600" 
    />
  </div>
);

export default AddMember;
