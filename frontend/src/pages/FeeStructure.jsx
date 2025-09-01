import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  Gift,
  Info,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const FeeStructure = () => {
  const { auth } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  // Loading State
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-300">
        <Loader2 className="animate-spin w-14 h-14 text-cyan-400 mb-6" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-lg font-medium tracking-wide text-cyan-300"
        >
          Fetching your fitness plans...
        </motion.p>
      </div>
    );

  // Empty State
  if (!fees.length)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-semibold text-white"
        >
          No Plans Available
        </motion.h2>
        <p className="text-sm text-gray-500 mt-2">
          Check back later or{" "}
          <Link to="/contact" className="text-cyan-400 hover:underline">
            contact us
          </Link>{" "}
          for custom options.
        </p>
      </div>
    );

  const filteredFees = fees.filter(
    (fee) =>
      fee.planName.toLowerCase().includes(search.trim().toLowerCase()) ||
      fee.amount.toString().includes(search.trim())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#00ffcc,_transparent_30%),radial-gradient(circle_at_bottom_right,_#ff00ff,_transparent_30%)] animate-pulse opacity-25"></div>

      {/* Hero Section */}
      <div className="text-center py-20 px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 drop-shadow-lg"
        >
          Membership Plans
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 max-w-2xl mx-auto text-lg"
        >
          Flexible, transparent, and tailored for your future fitness journey.
        </motion.p>
      </div>

      {/* Admin Manage Button */}
      {auth?.role === "admin" && (
        <div className="text-center mb-10 relative z-10">
          <Link
            to="/admin/fees"
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition transform hover:shadow-glow"
          >
            Manage Plans
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex justify-center mb-12 px-6 relative z-10">
        <input
          type="text"
          placeholder="🔍 Search by plan or amount..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Plan Cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-16 relative z-10"
      >
        {filteredFees.map((fee) => (
          <motion.div
            key={fee._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.06 }}
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-8 text-center overflow-hidden group hover:shadow-cyan-500/30 transition"
          >
            {/* Glow border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-20 blur-xl group-hover:opacity-40 transition"></div>

            {/* Icon */}
            <div className="relative flex justify-center mb-5">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full shadow-lg">
                <CreditCard size={30} />
              </div>
            </div>

            {/* Plan Name */}
            <h2 className="relative text-2xl font-extrabold mb-2 text-white">
              {fee.planName}
            </h2>

            {/* Price */}
            <p className="relative text-cyan-400 font-bold text-3xl mb-4">
              ₹{fee.amount}
            </p>

            {/* Description */}
            <div className="relative flex items-center justify-center text-gray-300 text-sm mb-4">
              <Info size={16} className="mr-2 text-blue-400" />
              <span>{fee.description || "No description provided"}</span>
            </div>

            {/* Offer */}
            {fee.offer && (
              <div className="relative inline-flex items-center text-sm font-medium bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 px-5 py-2 rounded-full shadow-md">
                <Gift size={16} className="mr-2" />
                {fee.offer}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-24 text-center px-6 relative z-10"
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center gap-2">
          <Sparkles className="text-cyan-300" />
          Your Fitness, Your Future
        </h3>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Choose the plan that fits your lifestyle and take the first step
          toward your transformation today.
        </p>
        <div className="flex justify-center">
          <Link
            to="/contact"
            className="w-full md:w-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-lg font-semibold px-12 py-4 rounded-2xl shadow-lg hover:scale-105 transition transform hover:shadow-cyan-400/50 text-center"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default FeeStructure;
