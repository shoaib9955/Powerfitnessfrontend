// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, role, user } = res.data;

      // Get role safely
      const userRole = role || user?.role;

      if (userRole !== "admin") {
        alert("Only admin can login.");
        setLoading(false);
        return;
      }

      // Save token and role in AuthContext
      login(token, userRole);

      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold mb-3 text-center">Admin Login</h2>
        <p className="text-sm text-gray-300 mb-8 text-center">
          🚀 Restricted Access – Admins Only
        </p>

        {/* Username */}
        <label className="block mb-2 text-gray-200">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-white/30 bg-white/5 px-3 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
          placeholder="Enter username"
          required
        />

        {/* Password */}
        <label className="block mb-2 text-gray-200">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-white/30 bg-white/5 px-3 py-2 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
          placeholder="Enter password"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform hover:shadow-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
