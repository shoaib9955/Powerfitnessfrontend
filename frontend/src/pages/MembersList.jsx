import React, { useEffect, useState } from "react";
import api from "../api";
import EmptyState from "../components/ui/EmptyState";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await api.delete(`/members/${memberId}`);
      fetchMembers();
    } catch (err) {
      alert("Error: Failed to delete member.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!members.length)
    return (
      <div className="min-h-screen pt-64 bg-slate-50 px-8">
        <EmptyState 
          title="List Empty" 
          message="No members found. Start by adding your first member." 
          icon={FaUsers}
          action={{
            label: "Add Member",
            onClick: () => navigate("/add-member"),
          }}
        />
      </div>
    );

  return (
    <div className="min-h-screen p-8 md:p-16 bg-[var(--bg-main)] pt-64">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 px-4">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em] block mb-4">Admin</span>
            <h1 className="text-5xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase">Member List</h1>
          </div>
          <button 
            onClick={() => navigate("/add-member")}
            className="premium-button bg-indigo-600 text-white px-8 flex items-center gap-3 shadow-xl shadow-indigo-100 dark:shadow-none"
          >
            Add Member
          </button>
        </div>

        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/20 border-b border-[var(--border-color)]">
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Member Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Contact</th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {members.map((m) => (
                  <tr key={m._id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 dark:text-slate-500 font-premium">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-[var(--text-primary)] uppercase tracking-tight">{m.name}</div>
                          <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">{m.sex || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-[var(--text-primary)] opacity-80">{m.email}</div>
                      <div className="text-xs font-medium text-[var(--text-secondary)] mt-1">{m.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/receipt/${m._id}`)}
                          className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          title="View Invoice"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Decommission"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
