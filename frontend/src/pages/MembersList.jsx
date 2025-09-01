import React, { useEffect, useState } from "react";
import api from "../api";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("api/members");
      setMembers(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete member (soft delete + history)
  const handleDelete = async (memberId) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await api.delete(`api/members/${memberId}`);
      alert("Member deleted successfully");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

  // Restore deleted member from history
  const handleRestore = async (historyId) => {
    if (!window.confirm("Restore this member?")) return;
    try {
      await api.post(`api/members/restore/${historyId}`);
      alert("Member restored successfully");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to restore member");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading members...</p>;
  if (!members.length)
    return <p className="text-center mt-20">No members found</p>;

  return (
    <div className="min-h-screen p-8 md:p-20 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Member List</h1>
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m._id}>
                <td className="border px-4 py-2">{m.name}</td>
                <td className="border px-4 py-2">{m.email}</td>
                <td className="border px-4 py-2">{m.phone}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  {/* If you want restore button for already deleted members, you can show here by passing historyId */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
