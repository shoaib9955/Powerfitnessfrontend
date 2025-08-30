import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FeeStructure = () => {
  const [fees, setFees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/fees");
        setFees(res.data);
      } catch (error) {
        console.error("Failed to fetch fees:", error);
      }
    };
    fetchFees();
  }, []);

  const handleContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-100 to-red-200 p-4 md:p-20">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-8 md:mb-12 text-red-800 tracking-wide">
        Our Fee Structure
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/30 backdrop-blur-md border border-red-300 rounded-2xl shadow-lg text-sm md:text-base">
          <thead className="bg-red-600 text-white rounded-t-2xl">
            <tr>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left">Plan</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left">Amount</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left">
                Description
              </th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left">Offer</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee, index) => {
              let discountedAmount = fee.amount;
              if (fee.offer && fee.offer.includes("%")) {
                const percent = parseFloat(fee.offer);
                if (!isNaN(percent))
                  discountedAmount = fee.amount * (1 - percent / 100);
              }

              return (
                <motion.tr
                  key={fee._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="border-b border-red-300 hover:bg-red-100 transition"
                >
                  <td className="py-2 px-2 md:py-4 md:px-6 font-semibold text-red-700">
                    {fee.planName}
                  </td>
                  <td className="py-2 px-2 md:py-4 md:px-6 text-red-600 font-bold">
                    {fee.offer ? (
                      <>
                        <span className="line-through text-gray-500">
                          ₹{fee.amount}
                        </span>{" "}
                        <span>₹{discountedAmount.toFixed(0)}</span>
                      </>
                    ) : (
                      <>₹{fee.amount}</>
                    )}
                  </td>
                  <td className="py-2 px-2 md:py-4 md:px-6 text-gray-700">
                    {fee.description || "-"}
                  </td>
                  <td className="py-2 px-2 md:py-4 md:px-6 text-red-600 font-semibold">
                    {fee.offer || "-"}
                  </td>
                  <td className="py-2 px-2 md:py-4 md:px-6 text-center">
                    {/* Button wrapped in div instead of tr */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={handleContact}
                        className="bg-red-600 text-white py-1 px-3 md:py-2 md:px-4 rounded-lg hover:bg-red-700 transition text-sm md:text-base"
                      >
                        Contact Us
                      </button>
                    </motion.div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeStructure;
