import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MembersContext } from "../context/MembersContext";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addMember } = useContext(MembersContext);
  const token = localStorage.getItem("token");
  const limit = 20; // records per page

  const fetchHistory = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:4000/api/history?page=${pageNumber}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHistories(res.data.histories);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch history.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const handleRestore = async (id) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:4000/api/history/restore/${id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistories(histories.filter((h) => h._id !== id));
      addMember(res.data.member);
      setMessage("✅ Member restored successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to restore member.");
      setMessageType("error");
    }
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);
  const cancelDelete = () => setConfirmDeleteId(null);

  const executeDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:4000/api/history/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if this was the last item on the page
      if (histories.length === 1 && page > 1) {
        const newPage = page - 1;
        setPage(newPage);
        fetchHistory(newPage); // fetch previous page immediately
      } else {
        // Otherwise just remove the deleted item from current page
        setHistories(histories.filter((h) => h._id !== id));
      }

      setMessage("🗑️ History entry deleted permanently!");
      setMessageType("success");
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete history entry.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Member History</h2>

      {message && (
        <div
          className={`mb-4 text-center py-2 px-4 rounded ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading history...</p>
      ) : histories.length === 0 ? (
        <p className="text-center text-gray-500">No history entries found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {histories.map((h) => {
              const member = h.details || {};
              return (
                <motion.div
                  key={h._id}
                  layout
                  className="bg-white rounded-2xl shadow-lg p-4 text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold">
                    {member.name || "Unknown Member"}
                  </h3>
                  <p>📞 {member.phone || "-"}</p>
                  <p>📧 {member.email || "-"}</p>
                  <p>⚥ {member.sex || "-"}</p>
                  <p>⏳ {member.duration || "-"}</p>
                  <p>💰 Paid: {Number(member.amountPaid) || 0}</p>
                  <p>❌ Due: {Number(member.due) || 0}</p>
                  <p>📝 Action: {h.action}</p>

                  <div className="flex justify-center gap-2 mt-3 flex-wrap">
                    {h.action !== "Restored" && (
                      <button
                        onClick={() => handleRestore(h._id)}
                        className="bg-green-600 text-white py-1 px-2 rounded"
                      >
                        Restore
                      </button>
                    )}

                    {confirmDeleteId === h._id ? (
                      <div className="flex gap-2 items-center justify-center">
                        <span className="text-red-600 font-semibold">
                          Confirm delete?
                        </span>
                        <button
                          onClick={() => executeDelete(h._id)}
                          className="bg-red-600 text-white py-1 px-2 rounded"
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="bg-gray-300 text-black py-1 px-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => confirmDelete(h._id)}
                        className="bg-red-600 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
