import React, { useEffect, useState } from "react";
import api from "../api";
import EmptyState from "../components/ui/EmptyState";
import { FaHistory } from "react-icons/fa";
import { MdRestore } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistories(res.data.data || []);
    } catch (err) {
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (historyId) => {
    if (!window.confirm("Restore this member?")) return;
    try {
      await api.post(`/members/restore/${historyId}`);
      fetchHistory();
    } catch (err) {
      alert("Error: Failed to restore member.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await api.delete(`/members/${id}`);
      fetchHistory();
    } catch (err) {
      alert("Error: Delete failed.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!histories.length)
    return (
      <div className="min-h-screen pt-24 bg-slate-50 px-8">
        <EmptyState 
          title="History Empty" 
          message="No records found. Activity will show up here automatically." 
          icon={FaHistory}
          action={{
            label: "Member Roster",
            onClick: () => navigate("/members"),
            icon: MdRestore
          }}
        />
      </div>
    );

  return (
    <div className="min-h-screen p-8 md:p-16 bg-[var(--bg-main)] pt-64">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em] block mb-4">Records</span>
          <h1 className="text-5xl md:text-6xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase mb-4">Gym <span className="text-indigo-600 dark:text-indigo-400">History</span></h1>
          <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-[0.3em]">Track all member actions and changes here</p>
        </div>

        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/20 border-b border-[var(--border-color)]">
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Member</th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Action</th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Time</th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {histories.map((h) => (
                  <tr key={h._id} className="group hover:bg-slate-50/50 dark:hover:bg-indigo-900/10 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 dark:text-slate-500 font-premium text-xs">
                          {h.details?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--text-primary)] uppercase tracking-tight text-sm">{h.details?.name || "Unknown Entity"}</div>
                          <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">ID: {h._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        h.action === "Deleted" ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400" : "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                      }`}>
                        {h.action || "Standard"}
                      </span>
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] mt-2">By: {h.performedBy?.username || "Admin"}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-bold text-[var(--text-primary)] opacity-80">
                        {h.createdAt ? new Date(h.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                      </div>
                      <div className="text-[10px] font-medium text-[var(--text-secondary)] mt-1">
                        {h.createdAt ? new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        {h.action === "Deleted" && (
                          <button
                            onClick={() => handleRestore(h._id)}
                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm border border-indigo-100/50 dark:border-indigo-900/30"
                          >
                            Reinstate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(h._id)}
                          className="px-4 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm border border-rose-100/50 dark:border-rose-900/30"
                        >
                          Erase
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-20 border-t border-[var(--border-color)] pt-12 text-center">
            <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-[0.5em]">End of Archives</p>
        </div>
      </div>
    </div>
  );
};

export default History;
