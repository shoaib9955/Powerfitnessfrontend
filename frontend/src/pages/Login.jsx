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

      const userRole = role || user?.role;
      if (userRole !== "admin") {
        alert("Only admin can login.");
        setLoading(false);
        return;
      }

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphic card */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8"
        >
          <h2 className="text-3xl font-extrabold mb-4 text-center text-green-400 tracking-wide">
            Admin Portal
          </h2>
          <p className="text-center text-sm text-gray-300 mb-6">
            🔐 Authorized access only — Admin login required.
          </p>

          {/* Username */}
          <label className="block text-gray-200 mb-2 text-sm">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-600 bg-gray-900/60 text-white px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 outline-none transition"
            required
          />

          {/* Password */}
          <label className="block text-gray-200 mb-2 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-600 bg-gray-900/60 text-white px-3 py-2 rounded-lg mb-6 focus:ring-2 focus:ring-green-500 outline-none transition"
            required
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 shadow-lg transform hover:scale-105 transition"
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : "🚀 Login as Admin"}
          </button>
        </form>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          ⚠️ Access restricted to administrators only.
        </p>
      </div>
    </div>
  );
};

export default Login;
