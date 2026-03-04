import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { FaUserShield, FaLock, FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Settings = () => {
  const { auth, setAuth } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    username: "",
    emailForReceipts: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setFormData(prev => ({
        ...prev,
        username: res.data.username || "",
        emailForReceipts: res.data.emailForReceipts || ""
      }));
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!formData.currentPassword) {
      return setMessage({ type: "error", text: "Current password is required to save changes." });
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      return setMessage({ type: "error", text: "New password must be at least 6 characters." });
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return setMessage({ type: "error", text: "New passwords do not match." });
    }

    setLoading(true);

    try {
      const payload = {
        currentPassword: formData.currentPassword,
        username: formData.username,
        emailForReceipts: formData.emailForReceipts,
      };

      if (formData.newPassword) {
        payload.newPassword = formData.newPassword;
      }

      const res = await api.put("/auth/settings", payload);
      
      // Update token if username changed
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        // We only need to update context if role or something else changed, but good practice
        setAuth({ ...auth, token: res.data.token });
      }

      setMessage({ type: "success", text: "Settings updated successfully! Receipts will now use your custom email." });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update settings." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen p-8 md:p-16 bg-[var(--bg-main)] pt-64">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em] block mb-4">Administration</span>
          <h1 className="text-5xl font-black text-[var(--text-primary)] tracking-tight font-premium flex items-center gap-4">
            <FaUserShield className="text-indigo-600 dark:text-indigo-400" /> System Settings
          </h1>
          <p className="text-[var(--text-secondary)] font-medium mt-4">Manage your administrative credentials and receipt delivery email.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Decorative Backing */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-bl-[100px] -z-10" />

          {/* Feedback Message */}
          <AnimatePresence>
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: "auto", mb: 40 }}
                exit={{ opacity: 0, height: 0, mb: 0 }}
                className={`p-5 rounded-2xl flex items-center gap-4 overflow-hidden border ${
                  message.type === "success" 
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400" 
                    : "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50 text-rose-700 dark:text-rose-400"
                }`}
              >
                <div className={`p-2 rounded-xl text-white ${message.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}>
                  {message.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                </div>
                <span className="font-bold text-sm">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Account Details Section */}
            <div>
               <h3 className="text-xl font-black text-[var(--text-primary)] font-premium uppercase tracking-tight mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] flex items-center justify-center border border-[var(--border-color)]">
                   <FaUserShield className="text-indigo-600 text-sm" />
                 </div>
                 Account Basics
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-11">
                 <Input 
                   label="Admin Username" 
                   name="username" 
                   value={formData.username} 
                   onChange={handleChange} 
                   required
                 />
                 <Input 
                   label="Receipt Sender Email" 
                   name="emailForReceipts" 
                   type="email"
                   value={formData.emailForReceipts} 
                   onChange={handleChange} 
                   placeholder="e.g. billing@powerfitness.com"
                 />
               </div>
               <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-4 pl-0 md:pl-11">
                 * If sender email is blank, receipts will be sent from the default system email.
               </p>
            </div>

            <hr className="border-[var(--border-color)] my-8" />

            {/* Password Section */}
            <div>
               <h3 className="text-xl font-black text-[var(--text-primary)] font-premium uppercase tracking-tight mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] flex items-center justify-center border border-[var(--border-color)]">
                   <FaLock className="text-indigo-600 text-sm" />
                 </div>
                 Change Password <span className="text-[10px] text-[var(--text-secondary)] tracking-widest font-bold ml-2">(Optional)</span>
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-11">
                 <Input 
                   label="New Password" 
                   name="newPassword" 
                   type="password"
                   value={formData.newPassword} 
                   onChange={handleChange} 
                   placeholder="Leave blank to keep current"
                 />
                 <Input 
                   label="Confirm New Password" 
                   name="confirmPassword" 
                   type="password"
                   value={formData.confirmPassword} 
                   onChange={handleChange} 
                 />
               </div>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 md:p-8 mt-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-4">Authorization Required</h4>
               <div className="flex flex-col md:flex-row gap-6 items-end">
                 <div className="flex-1 w-full">
                   <Input 
                     label="Current Password" 
                     name="currentPassword" 
                     type="password"
                     value={formData.currentPassword} 
                     onChange={handleChange} 
                     required
                     placeholder="Enter your current password to save changes"
                   />
                 </div>
                 <button 
                   type="submit"
                   disabled={loading}
                   className={`premium-button w-full md:w-auto px-10 py-4 font-black uppercase tracking-widest shadow-xl transition-all ${
                     loading || !formData.currentPassword
                       ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                       : "bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 shadow-slate-200 dark:shadow-none"
                   }`}
                 >
                   {loading ? "Saving..." : "Save Changes"}
                 </button>
               </div>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3 ml-1">{label}</label>
    <input 
      {...props}
      className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)] transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600" 
    />
  </div>
);

export default Settings;
