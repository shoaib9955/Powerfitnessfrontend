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
      const res = await api.get("/members");
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
      await api.delete(`/members/${memberId}`);
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
      await api.post(`/members/restore/${historyId}`);
      alert("Member restored successfully");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to restore member");
    }
  };

  // View Receipt (open in new tab)
  const handleViewReceipt = (memberId) => {
    window.open(`/receipt/${memberId}`, "_blank");
  };

  // Download Receipt as PDF
  const handleDownloadReceipt = async (memberId) => {
    try {
      const res = await api.get(`/receipt/${memberId}`, {
        responseType: "blob", // important for file downloads
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${memberId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download receipt");
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
                <td className="border px-4 py-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewReceipt(m._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View Receipt
                  </button>
                  <button
                    onClick={() => handleDownloadReceipt(m._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Download Receipt
                  </button>
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
