import React from "react";
import { motion } from "framer-motion";
import { FaInbox } from "react-icons/fa";

const EmptyState = ({ 
  title = "No Records Found", 
  message = "It seems there's nothing to show in this sector yet.", 
  icon: Icon = FaInbox,
  action 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-16 text-center bg-[var(--bg-surface)] max-w-xl mx-auto border-[var(--border-color)] shadow-indigo-100/20 dark:shadow-none"
    >
      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-[var(--border-color)]">
        <Icon className="text-slate-400 dark:text-slate-500 text-5xl" />
      </div>
      <h3 className="text-3xl font-black text-[var(--text-primary)] mb-3 font-premium uppercase tracking-tight">{title}</h3>
      <p className="text-[var(--text-secondary)] font-medium mb-10 leading-relaxed max-w-xs mx-auto">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="premium-button bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-10 flex items-center gap-3 mx-auto shadow-xl shadow-slate-200 dark:shadow-none"
        >
          {action.icon && <action.icon />}
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
