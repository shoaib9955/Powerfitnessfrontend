// src/pages/FeeStructure.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const FeeStructure = () => {
  const { auth } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get("/fees");
        setFees(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setFees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-white">Loading fees...</p>;
  if (!fees.length)
    return <p className="text-center mt-20 text-white">No fees available</p>;

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold text-center mt-20 mb-10 text-green-400 tracking-wide">
        💰 Fee Structure
      </h1>

      {/* Admin Manage Fees Button */}
      {auth?.role === "admin" && (
        <div className="text-center mb-6">
          <Link
            to="/admin/fees"
            className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-2 rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transition transform hover:scale-105"
          >
            Manage Fees
          </Link>
        </div>
      )}

      {/* Table Container */}
      <div className="max-w-5xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead className="bg-gray-700/60 text-green-300 uppercase">
              <tr>
                <th className="border px-4 py-3">Plan</th>
                <th className="border px-4 py-3">Amount</th>
                <th className="border px-4 py-3">Description</th>
                <th className="border px-4 py-3">Offer</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr
                  key={fee._id}
                  className="hover:bg-gray-800/60 transition-colors"
                >
                  <td className="border px-4 py-3 text-center">
                    {fee.planName}
                  </td>
                  <td className="border px-4 py-3 text-center">
                    ₹{fee.amount}
                  </td>
                  <td className="border px-4 py-3">{fee.description || "-"}</td>
                  <td className="border px-4 py-3">{fee.offer || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Us Button */}
      <div className="text-center mt-10">
        <Link
          to="/contact"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-full shadow-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
        >
          📩 Contact Us
        </Link>
      </div>
    </div>
  );
};

export default FeeStructure;
