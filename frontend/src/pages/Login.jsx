import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import gymImage from "../assets/gym3.jpeg";
import { motion } from "framer-motion";
import { FaLock, FaUser, FaArrowRight } from "react-icons/fa";

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
        alert("Access Denied: Administrative privileges required.");
        setLoading(false);
        return;
      }

      login(token, userRole);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-main)]">
      {/* Background with parallax effect or static zoom */}
      <div className="absolute inset-0 z-0">
        <img
          src={gymImage}
          alt="Gym Background"
          className="w-full h-full object-cover opacity-20 dark:opacity-40 filter contrast-125 saturate-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/60 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[450px] px-6"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-6">
            <FaLock className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase font-premium">
            <span className="text-indigo-600 dark:text-indigo-400">Admin</span> Portal
          </h1>
          <p className="text-[var(--text-secondary)] font-bold text-xs uppercase tracking-[0.3em] mt-3">Authorized Personnel Only</p>
        </div>

        <div className="glass-morphism p-10 rounded-[3rem] shadow-2xl relative border border-[var(--border-color)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3 ml-1">Identity Tag</label>
                <div className="relative group">
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 dark:bg-slate-800/50 border border-[var(--border-color)] focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] block mb-3 ml-1">Secure Key</label>
                <div className="relative group">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 dark:bg-slate-800/50 border border-[var(--border-color)] focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="premium-button w-full py-5 bg-indigo-600 text-white hover:bg-indigo-700 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-indigo-900/40 dark:shadow-none"
            >
              {loading ? "Decrypting..." : <>Initiate Session <FaArrowRight /></>}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.2em]">
          End-to-End Encrypted System
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
