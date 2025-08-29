import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryList = () => {
  const [history, setHistory] = useState([]);

  // Fetch all history logs
  const fetchHistory = async () => {
    try {
      const { data } = await axios.get("/api/history", {
        withCredentials: true,
      });
      setHistory(data);
    } catch (err) {
      console.error("FETCH HISTORY ERROR:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Delete a history record
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this history record permanently?")) return;

    try {
      await axios.delete(`/api/history/${id}`, { withCredentials: true });
      alert("History deleted");
      fetchHistory();
    } catch (err) {
      console.error("DELETE HISTORY ERROR:", err);
      alert("Failed to delete history");
    }
  };

  // Restore member from history
  const handleRestore = async (id) => {
    if (!window.confirm("Restore this member from history?")) return;

    try {
      await axios.post(
        `/api/history/restore/${id}`,
        {},
        { withCredentials: true }
      );
      alert("Member restored successfully");
      fetchHistory();
    } catch (err) {
      console.error("RESTORE ERROR:", err);
      alert("Failed to restore member");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">History Logs</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Action</th>
            <th className="p-2 border">Member ID</th>
            <th className="p-2 border">Performed By</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h._id} className="text-center border-b">
              <td className="p-2 border">{h.action}</td>
              <td className="p-2 border">{h.memberId}</td>
              <td className="p-2 border">
                {h.createdBy?.username} ({h.createdBy?.role})
              </td>

              <td className="p-2 border">
                {new Date(h.createdAt).toLocaleString()}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleRestore(h._id)}
                >
                  Restore
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(h._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No history records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryList;
