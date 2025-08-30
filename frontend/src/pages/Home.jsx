import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaInfoCircle,
  FaPhone,
  FaMoneyBill,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import gymImage from "../assets/gym3.jpeg";
import ownerImage from "../assets/owner.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "About Us",
      icon: <FaInfoCircle size={24} />,
      bg: "from-blue-500 to-purple-600",
      link: "/about",
    },
    {
      title: "Contact Us",
      icon: <FaPhone size={24} />,
      bg: "from-green-400 to-yellow-400",
      link: "/contact",
    },
    {
      title: "Fees",
      icon: <FaMoneyBill size={24} />,
      bg: "from-red-500 to-pink-500",
      link: "/fees",
    },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] md:h-screen flex flex-col justify-center items-center text-center px-4 text-white overflow-hidden">
        <img
          src={gymImage}
          alt="Gym"
          className="absolute inset-0 w-full h-full max-h-screen object-center filter brightness-95 contrast-110 saturate-110"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <motion.div
          className="relative z-10 max-w-3xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-wide">
            <span className="text-yellow-300">Power</span>Fitness
          </h1>
          <motion.p
            className="text-lg sm:text-lg md:text-xl mb-6 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Welcome to <strong>PowerFitness</strong> – a premium gym with
            experienced trainers, state-of-the-art equipment, and a holistic
            approach to fitness. Achieve your goals in a motivating and
            futuristic environment!
          </motion.p>
        </motion.div>
      </section>

      {/* Owner Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-300 shadow-2xl hover:scale-105 transition-transform duration-500">
            <img
              src={ownerImage}
              alt="Shaban Qazi"
              className="w-full h-full object-cover"
            />
            <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 opacity-50 animate-pulse"></div>
          </div>
        </motion.div>

        <motion.div
          className="text-center md:text-left max-w-xl bg-red/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-300 mb-2">
            Shaban Qazi
          </h2>
          <p className="text-red-500 text-md md:text-lg mb-4">
            Owner & Head Trainer
          </p>
          <p className="text-pink-500 mb-4">
            With over 10 years of experience in fitness training, Shaban has
            helped hundreds of clients achieve their goals. He specializes in
            strength training, functional fitness, and nutrition guidance. At
            PowerFitness, his vision is to create a supportive and motivating
            environment for everyone.
          </p>
          <a
            href="https://www.instagram.com/shabanqazi_11"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-pink-500 to-yellow-400 py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <FaInstagram /> Follow on Instagram
          </a>
        </motion.div>
      </section>

      {/* Futuristic Cards Section */}
      <section className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            className={`cursor-pointer relative p-6 rounded-2xl shadow-2xl text-white flex flex-col items-center justify-center bg-gradient-to-r ${card.bg} hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-transform duration-500`}
            onClick={() => navigate(card.link)}
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl md:text-2xl font-bold">{card.title}</h3>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
