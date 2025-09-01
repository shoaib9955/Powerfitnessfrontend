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

  if (loading) return <p className="text-center mt-20">Loading fees...</p>;
  if (!fees.length)
    return <p className="text-center mt-20">No fees available</p>;

  return (
    <div className="min-h-screen p-8 md:p-20 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Fee Structure</h1>
      {auth?.role === "admin" && (
        <div className="text-center mb-4">
          <Link
            to="/admin/fees"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Manage Fees
          </Link>
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Plan</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Offer</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee._id}>
                <td className="border px-4 py-2">{fee.planName}</td>
                <td className="border px-4 py-2">{fee.amount}</td>
                <td className="border px-4 py-2">{fee.description || "-"}</td>
                <td className="border px-4 py-2">{fee.offer || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeStructure;
