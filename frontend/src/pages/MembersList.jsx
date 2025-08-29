import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editAvatar, setEditAvatar] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDuration, setFilterDuration] = useState("All");
  const [filterDue, setFilterDue] = useState("All");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const token = localStorage.getItem("token");

  // Fetch all members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:4000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch members.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle edit input change
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save edit
  const handleEditSubmit = async (memberId) => {
    try {
      const data = new FormData();
      Object.keys(editData).forEach((key) => data.append(key, editData[key]));
      if (editAvatar) data.append("avatar", editAvatar);

      const res = await axios.put(
        `http://127.0.0.1:4000/api/members/${memberId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMembers(members.map((m) => (m._id === memberId ? res.data : m)));
      setEditId(null);
      setEditData({});
      setEditAvatar(null);

      setMessage("✅ Member updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update member.");
      setMessageType("error");
    }
  };

  // Delete member
  const handleDelete = async (memberId) => {
    try {
      await axios.delete(`http://127.0.0.1:4000/api/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((m) => m._id !== memberId));
      setDeleteConfirmId(null);

      setMessage("🗑️ Member deleted successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete member.");
      setMessageType("error");
    }
  };

  // Filtering logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDuration =
      filterDuration === "All" || m.duration === filterDuration;

    const matchesDue =
      filterDue === "All" ||
      (filterDue === "Due" && Number(m.due) > 0) ||
      (filterDue === "NoDue" && Number(m.due) === 0);

    return matchesSearch && matchesDuration && matchesDue;
  });

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Members List</h2>

      {/* ✅ Confirmation Message */}
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

      {/* Search & Filter Controls */}
      <div className="bg-white shadow p-4 rounded-lg mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search by name, phone, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <select
          value={filterDuration}
          onChange={(e) => setFilterDuration(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="All">All Durations</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="6 Months">6 Months</option>
          <option value="1 Year">1 Year</option>
        </select>

        <select
          value={filterDue}
          onChange={(e) => setFilterDue(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="All">All Members</option>
          <option value="Due">Due Only</option>
          <option value="NoDue">No Due</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500">Loading members...</p>
      ) : filteredMembers.length === 0 ? (
        <p className="text-center text-gray-500">No members found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <motion.div
              key={member._id}
              layout
              className="bg-white rounded-2xl shadow-lg p-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {editId === member._id ? (
                // 🔹 Editable form
                <>
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ""}
                    onChange={handleEditChange}
                    placeholder="Name"
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone || ""}
                    onChange={handleEditChange}
                    placeholder="Phone"
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ""}
                    onChange={handleEditChange}
                    placeholder="Email"
                    className="border p-1 rounded w-full mb-1"
                  />
                  <select
                    name="sex"
                    value={editData.sex || "Male"}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full mb-1"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select
                    name="duration"
                    value={editData.duration || "1 Month"}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full mb-1"
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                  <input
                    type="number"
                    name="amountPaid"
                    value={editData.amountPaid || ""}
                    onChange={handleEditChange}
                    placeholder="Amount Paid"
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    type="number"
                    name="due"
                    value={editData.due || ""}
                    onChange={handleEditChange}
                    placeholder="Due Amount"
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditAvatar(e.target.files[0])}
                    className="mb-2"
                  />

                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => handleEditSubmit(member._id)}
                      className="bg-green-600 text-white py-1 px-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditData({});
                        setEditAvatar(null);
                      }}
                      className="bg-gray-400 text-white py-1 px-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                // 🔹 Display mode
                <>
                  <img
                    src={
                      member.avatar
                        ? `http://127.0.0.1:4000/uploads/${member.avatar}`
                        : "/default-avatar.png"
                    }
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p>📞 {member.phone}</p>
                  <p>📧 {member.email}</p>
                  <p>⚥ {member.sex}</p>
                  <p>⏳ {member.duration}</p>
                  <p>
                    📅 Expiry:{" "}
                    {new Date(member.expiryDate).toLocaleDateString()}
                  </p>
                  <p>💰 Paid: {member.amountPaid || 0}</p>
                  <p>❌ Due: {member.due || 0}</p>

                  <div className="flex justify-center gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => {
                        setEditId(member._id);
                        setEditData(member);
                      }}
                      className="bg-yellow-500 text-white py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                    {deleteConfirmId === member._id ? (
                      <div className="flex gap-2 items-center">
                        <span className="text-sm text-red-600">
                          Confirm delete?
                        </span>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="bg-red-600 text-white py-1 px-2 rounded"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="bg-gray-400 text-white py-1 px-2 rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(member._id)}
                        className="bg-red-600 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    )}
                    <a
                      href={`/receipt/${member._id}`}
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                    >
                      View Receipt
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersList;
