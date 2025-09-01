import React, { useState, useRef } from "react";
import api from "../api"; // centralized Axios instance
import { Link, useNavigate } from "react-router-dom";

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    sex: "Male",
    duration: "1", // ✅ send numeric string
    amountPaid: "",
    due: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [memberCreated, setMemberCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (avatar) data.append("avatar", avatar);

    try {
      const res = await api.post("api/members", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMemberCreated(res.data);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        sex: "Male",
        duration: "1",
        amountPaid: "",
        due: "",
      });
      setAvatar(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setMessage({
        type: "success",
        text: `✅ Member added successfully! Receipt emailed.`,
      });
    } catch (err) {
      console.error("AddMember Error:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: "❌ Failed to add member or send email. Check console.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Add New Member</h2>
        {message.text && (
          <p
            className={`mb-4 text-center font-semibold ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
        />
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="1">1 Month</option>
          <option value="3">3 Months</option>
          <option value="6">6 Months</option>
          <option value="12">1 Year</option>
        </select>
        <input
          type="number"
          name="amountPaid"
          placeholder="Amount Paid"
          value={formData.amountPaid}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="number"
          name="due"
          placeholder="Due Amount"
          value={formData.due}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setAvatar(e.target.files[0])}
          className="mb-3"
        />
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white py-2 px-4 rounded w-full`}
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </form>

      {memberCreated && (
        <div className="mt-4 flex flex-col gap-2">
          <Link
            to={`/receipt/${memberCreated._id}`}
            className="bg-yellow-400 text-green-700 py-2 px-4 rounded text-center"
          >
            View Receipt
          </Link>
          <Link
            to="/members"
            className="bg-blue-500 text-white py-2 px-4 rounded text-center"
          >
            Go to Member List
          </Link>
        </div>
      )}
    </div>
  );
};

export default AddMember;
