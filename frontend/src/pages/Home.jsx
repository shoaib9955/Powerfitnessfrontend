import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gymImage from "../assets/gym3.png"; // import your image

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section
        className="relative h-[80vh] flex flex-col justify-center items-center text-center px-4 text-white"
        style={{
          backgroundImage: `url(${gymImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wide">
            <span className="text-yellow-300">Power</span>Fitness
          </h1>
          <p className="text-lg md:text-2xl mb-6">
            Manage your gym, track members, and provide instant receipts!
          </p>
          <Link
            to="/add-member"
            className="bg-yellow-300 text-green-700 font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform duration-300"
          >
            Add New Member
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 text-center hover:scale-105 transition-transform duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-2">Track Members</h2>
          <p className="text-gray-600">
            Add, edit, and monitor all your gym members easily.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 text-center hover:scale-105 transition-transform duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-2">Instant Receipts</h2>
          <p className="text-gray-600">
            Generate receipts for members automatically after adding.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 text-center hover:scale-105 transition-transform duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-2">Futuristic UI</h2>
          <p className="text-gray-600">
            Responsive and stylish interface with animations and gradients.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
