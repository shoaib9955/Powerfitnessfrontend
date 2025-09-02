// src/pages/MemberList.jsx
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

  const handleDelete = async (memberId) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await api.delete(`/members/${memberId}`);
      alert("Member deleted successfully ✅");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete member");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-white text-lg animate-pulse">
        ⏳ Loading members...
      </p>
    );

  if (!members.length)
    return (
      <p className="text-center mt-20 text-gray-300 text-lg">
        ⚠️ No members found
      </p>
    );

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 mt-20 text-green-400 tracking-wide">
        👥 Member List
      </h1>

      {/* --- Table for medium+ devices --- */}
      <div className="hidden md:block max-w-6xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-base">
            <thead className="bg-gray-700/60 text-green-300 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m._id}
                  className="hover:bg-gray-800/60 transition-colors"
                >
                  <td className="px-4 py-3">{m.name}</td>
                  <td className="px-4 py-3">{m.email}</td>
                  <td className="px-4 py-3">{m.phone}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1.5 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Card view for small devices --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
        {members.map((m) => (
          <div
            key={m._id}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-4"
          >
            <h2 className="text-lg font-bold text-green-400">{m.name}</h2>
            <p className="text-sm text-gray-300">📧 {m.email}</p>
            <p className="text-sm text-gray-300">📞 {m.phone}</p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleDelete(m._id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition text-sm"
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
