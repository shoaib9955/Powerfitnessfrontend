import React, { useEffect, useState } from "react";
import api from "../api";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history"); // your backend history route
      const data = Array.isArray(res.data.data) ? res.data.data : [];

      const sanitized = data.map((h) => ({
        _id: h._id,
        action: String(h.action || "-"),
        details: { name: String(h.details?.name || "-") },
        performedBy: { username: String(h.performedBy?.username || "-") },
        createdAt: h.createdAt ? new Date(h.createdAt).toISOString() : "-",
      }));

      setHistories(sanitized);
    } catch (err) {
      console.error(
        "❌ Fetch history error:",
        err.response?.data || err.message
      );
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (historyId) => {
    if (!window.confirm("Restore this member?")) return;
    try {
      const res = await api.post(`/members/restore/${historyId}`);
      alert(res.data.message || "Member restored successfully");
      fetchHistory();
    } catch (err) {
      console.error("❌ Restore error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to restore member");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this member?")) return;
    try {
      const res = await api.delete(`/members/${id}`);
      alert(res.data.message || "Member deleted permanently");
      fetchHistory();
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete member");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading history...</p>;
  if (!histories.length)
    return <p className="text-center mt-20">No history records found</p>;

  return (
    <div className="min-h-screen p-8 md:p-20 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Member History</h1>
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Responsive Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Member Name</th>
                <th className="border px-4 py-2">Action</th>
                <th className="border px-4 py-2">Performed By</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Restore</th>
                <th className="border px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((h) => (
                <tr key={h._id}>
                  <td className="border px-4 py-2">{h.details.name}</td>
                  <td className="border px-4 py-2">{h.action}</td>
                  <td className="border px-4 py-2">{h.performedBy.username}</td>
                  <td className="border px-4 py-2">
                    {h.createdAt !== "-"
                      ? new Date(h.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {h.action === "Deleted" ? (
                      <button
                        onClick={() => handleRestore(h._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Restore
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete Permanently
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {histories.map((h) => (
            <div
              key={h._id}
              className="border rounded-lg p-4 shadow-sm bg-gray-50"
            >
              <p>
                <strong>Member Name:</strong> {h.details.name}
              </p>
              <p>
                <strong>Action:</strong> {h.action}
              </p>
              <p>
                <strong>Performed By:</strong> {h.performedBy.username}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {h.createdAt !== "-"
                  ? new Date(h.createdAt).toLocaleString()
                  : "-"}
              </p>
              <div className="flex gap-2 mt-3">
                {h.action === "Deleted" && (
                  <button
                    onClick={() => handleRestore(h._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Restore
                  </button>
                )}
                <button
                  onClick={() => handleDelete(h._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
