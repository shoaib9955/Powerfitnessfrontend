import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import api from "../api";
import EmptyState from "../components/ui/EmptyState";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const FeeStructure = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get("/fees");
        setFees(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setFees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!fees.length)
    return (
      <div className="min-h-screen pt-64 bg-slate-50 px-8">
        <EmptyState 
          title="Tiers Unavailable" 
          message="We are currently recalibrating our membership packages. Please contact our concierge for immediate details." 
          icon={FaClipboardList}
          action={auth?.role === "admin" ? {
            label: "Administrative Portal",
            onClick: () => navigate("/admin/fees"),
          } : null}
        />
      </div>
    );

  return (
    <div className="min-h-screen p-8 md:p-16 bg-[var(--bg-main)] pt-64">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 px-4">
          <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em] block mb-4">Membership Plans</span>
          <h1 className="text-5xl md:text-6xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase mb-6">Choose Your <span className="text-indigo-600 dark:text-indigo-400">Plan</span></h1>
          <p className="max-w-xl mx-auto text-[var(--text-secondary)] font-bold text-xs uppercase tracking-[0.3em]">Start your fitness journey today</p>
          
          {auth?.role === "admin" && (
            <div className="mt-10">
              <Link
                to="/admin/fees"
                className="premium-button bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-8 py-3 text-[10px] tracking-widest"
              >
                Manage Plans
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {fees.map((fee, idx) => (
            <motion.div
              key={fee._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="premium-card p-12 flex flex-col items-center text-center group hover:-translate-y-2 transition-all relative overflow-hidden"
            >
              {fee.offer && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                  {fee.offer}
                </div>
              )}
              
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mb-8 border border-slate-100/50 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <FaClipboardList className="text-2xl" />
              </div>

              <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 font-premium uppercase tracking-tight">{fee.planName}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-[var(--text-primary)] font-premium">₹{fee.amount}</span>
                <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">/ Month</span>
              </div>
              
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-10 flex-grow">
                {fee.description || "Get full access to our gym equipment and professional trainers."}
              </p>

              <button 
                onClick={() => navigate("/contact")}
                className="premium-button w-full border-2 border-slate-950 dark:border-indigo-500 text-slate-950 dark:text-white hover:bg-slate-950 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white transition-all text-xs font-black uppercase tracking-widest py-4"
              >
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-32 p-12 glass-morphism rounded-[3rem] text-center">
             <h4 className="text-xl font-black text-[var(--text-primary)] font-premium uppercase tracking-tighter mb-2">Group Discounts</h4>
             <p className="text-[var(--text-secondary)] font-medium mb-0">Contact us for special deals on group and corporate memberships.</p>
        </div>
      </div>
    </div>
  );
};

export default FeeStructure;
