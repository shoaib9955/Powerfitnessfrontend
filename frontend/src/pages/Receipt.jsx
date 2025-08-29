// src/pages/Receipt.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Receipt = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:4000/api/members/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMember(res.data);
      } catch (err) {
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, token]);

  if (loading) return <p className="text-center mt-20">Loading receipt...</p>;
  if (!member)
    return (
      <p className="text-center mt-20 text-red-600">❌ Receipt not found</p>
    );

  return (
    <div className="max-w-md mx-auto mt-24 bg-white shadow-lg rounded-lg p-6 border">
      <h2 className="text-2xl font-bold text-center mb-6">
        🧾 Payment Receipt
      </h2>

      {member.avatar && (
        <img
          src={`http://127.0.0.1:4000/uploads/${member.avatar}`} // fixed path
          alt="Member Avatar"
          className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
        />
      )}

      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {member.name}
        </p>
        <p>
          <strong>Phone:</strong> {member.phone}
        </p>
        <p>
          <strong>Email:</strong> {member.email || "-"}
        </p>
        <p>
          <strong>Sex:</strong> {member.sex}
        </p>
        <p>
          <strong>Duration:</strong> {member.duration}
        </p>
        <p>
          <strong>Amount Paid:</strong> ₹{member.amountPaid || 0}
        </p>
        <p>
          <strong>Due:</strong> ₹{member.due || 0}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(member.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Expiry:</strong>{" "}
          {new Date(member.expiryDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong> {member.due > 0 ? "Pending" : "Paid"}
        </p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          🖨️ Print Receipt
        </button>
      </div>
    </div>
  );
};

export default Receipt;
