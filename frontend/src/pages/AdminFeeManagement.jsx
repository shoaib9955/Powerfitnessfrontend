import React, { useEffect, useState } from "react";
import api from "../api"; // use centralized Axios instance

const AdminFeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [newPlan, setNewPlan] = useState({
    planName: "",
    amount: "",
    description: "",
    offer: "",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await api.get("/fees");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setFees(data);
    } catch (error) {
      setFees([]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/fees", newPlan);
      setNewPlan({ planName: "", amount: "", description: "", offer: "" });
      fetchFees();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add fee plan.");
    }
  };

  const handleUpdate = async (id, updatedFee) => {
    try {
      await api.put(`/fees/${id}`, updatedFee);
      fetchFees();
    } catch (error) {
      alert("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/fees/${id}`);
      setConfirmDeleteId(null);
      fetchFees();
    } catch (error) {
      alert("Deletion failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8 md:p-16 pt-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 px-4 text-center md:text-left">
          <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em] block mb-4">Settings</span>
          <h1 className="text-5xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase">Manage <span className="text-indigo-600 dark:text-indigo-400">Plans</span></h1>
          <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Add and update membership plans for your gym</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Add New Fee Plan Form */}
          <div className="lg:col-span-4">
            <div className="premium-card p-10 sticky top-32">
              <h2 className="text-xl font-black mb-8 text-[var(--text-primary)] font-premium uppercase tracking-tighter">
                Add Plan
              </h2>
              <form className="space-y-6" onSubmit={handleAdd}>
                <Input 
                  label="Plan Name"
                  placeholder="e.g. 1 Month Access"
                  value={newPlan.planName}
                  onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })}
                  required
                />
                <Input 
                  label="Price (₹)"
                  type="number"
                  placeholder="0.00"
                  value={newPlan.amount}
                  onChange={(e) => setNewPlan({ ...newPlan, amount: e.target.value })}
                  required
                />
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block ml-1">Plan Description</label>
                  <textarea 
                    placeholder="Tier features and benefits..."
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-[var(--text-primary)] transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 min-h-[100px]"
                  />
                </div>
                <Input 
                  label="Special Offer"
                  placeholder="e.g. 20% Discount"
                  value={newPlan.offer}
                  onChange={(e) => setNewPlan({ ...newPlan, offer: e.target.value })}
                />
                <button
                  type="submit"
                  className="premium-button w-full bg-indigo-600 text-white hover:bg-indigo-700 mt-4 shadow-xl shadow-indigo-100 dark:shadow-none"
                >
                  Save Plan
                </button>
              </form>
            </div>
          </div>

          {/* Existing Fees Section */}
          <div className="lg:col-span-8">
            <div className="premium-card overflow-hidden">
              <div className="px-8 py-6 border-b border-[var(--border-color)] flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">Current Plans</h2>
                <span className="bg-[var(--bg-main)] px-3 py-1 rounded-full text-[9px] font-black text-indigo-600 dark:text-indigo-400 border border-[var(--border-color)] uppercase tracking-widest">{fees.length} Total</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/30 dark:bg-slate-800/10 border-b border-[var(--border-color)]">
                      <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Plan Name</th>
                      <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Price</th>
                      <th className="px-8 py-6 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-right">Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
                    {fees.map((fee) => (
                      <EditableRow
                        key={fee._id}
                        fee={fee}
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                        confirmDeleteId={confirmDeleteId}
                        setConfirmDeleteId={setConfirmDeleteId}
                      />
                    ))}
                    {fees.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-8 py-20 text-center">
                          <p className="text-[var(--text-secondary)] font-black uppercase text-[10px] tracking-widest">No plans defined in the registry</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableRow = ({
  fee,
  handleUpdate,
  handleDelete,
  confirmDeleteId,
  setConfirmDeleteId,
}) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...fee });

  if (editing) {
    return (
      <tr className="bg-indigo-50/30 dark:bg-indigo-900/10">
        <td className="px-8 py-6">
           <input
             value={editData.planName}
             onChange={(e) => setEditData({ ...editData, planName: e.target.value })}
             className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-[var(--text-primary)] text-sm"
           />
           <input
             placeholder="Short Description"
             value={editData.description || ""}
             onChange={(e) => setEditData({ ...editData, description: e.target.value })}
             className="w-full p-2 mt-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium text-[var(--text-secondary)] text-[10px] placeholder:text-slate-300 dark:placeholder:text-slate-600"
           />
        </td>
        <td className="px-8 py-6">
           <div className="flex items-center gap-2">
             <span className="text-[var(--text-secondary)] font-bold text-xs">₹</span>
             <input
               type="number"
               value={editData.amount}
               onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
               className="w-24 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-[var(--text-primary)] text-sm"
             />
           </div>
           <input
             placeholder="Offer Text"
             value={editData.offer || ""}
             onChange={(e) => setEditData({ ...editData, offer: e.target.value })}
             className="w-full p-2 mt-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium text-[var(--text-secondary)] text-[10px] placeholder:text-slate-300 dark:placeholder:text-slate-600"
           />
        </td>
        <td className="px-8 py-6">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                handleUpdate(fee._id, editData);
                setEditing(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-[9px] font-black uppercase tracking-widest"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-[9px] font-black uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-6">
        <div className="font-black text-slate-950 uppercase tracking-tight text-sm">{fee.planName}</div>
        <div className="text-[10px] font-medium text-slate-400 mt-1 max-w-[200px] truncate">{fee.description || "No manual summary provided."}</div>
      </td>
      <td className="px-8 py-6">
        <div className="text-sm font-black text-slate-950 font-premium">₹{fee.amount}</div>
        {fee.offer && (
          <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">
            <span className="bg-indigo-50 px-2 py-0.5 rounded-md">{fee.offer}</span>
          </div>
        )}
      </td>
      <td className="px-8 py-6">
        <div className="flex justify-end gap-3">
          {confirmDeleteId === fee._id ? (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">Confirm?</span>
              <button
                onClick={() => handleDelete(fee._id)}
                className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:shadow-indigo-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setConfirmDeleteId(fee._id)}
                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Reusable Input Component (Sync with AddMember)
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 ml-1">{label}</label>
    <input 
      {...props}
      className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300" 
    />
  </div>
);

export default AdminFeeManagement;
