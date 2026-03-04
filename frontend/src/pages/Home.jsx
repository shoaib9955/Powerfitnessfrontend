import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaInfoCircle,
  FaPhone,
  FaMoneyBill,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import gymImage from "../assets/gym3.jpeg";
import ownerImage from "../assets/owner.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Our Story",
      icon: <FaInfoCircle size={22} />,
      link: "/about",
      desc: "Learn about our mission and gym style."
    },
    {
      title: "Contact",
      icon: <FaPhone size={22} />,
      link: "/contact",
      desc: "Get in touch with our team today."
    },
    {
      title: "Pricing",
      icon: <FaMoneyBill size={22} />,
      link: "/fees",
      desc: "Find the best membership plan for you."
    },
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 scale-105">
          <img
            src={gymImage}
            alt="Gym"
            className="w-full h-full object-cover filter brightness-[0.7] contrast-125 grayscale-[0.1]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-[var(--bg-main)]"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="mb-6 flex justify-center">
            <span className="px-5 py-2 bg-indigo-600/30 backdrop-blur-md rounded-full text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-400/30">
              Premium Gym Experience
            </span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-none">
            <span className="font-premium">POWER</span>
            <span className="font-premium text-indigo-400">FITNESS</span>
          </h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-10 text-white/90 font-medium max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            The best equipment and professional personal training in Boisar. Start your fitness journey with us today.
          </motion.p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/fees")}
            className="premium-button bg-white text-slate-950 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-50 transition-all flex items-center gap-3 mx-auto"
          >
            View Plans <FaArrowRight className="text-indigo-600" />
          </motion.button>
        </motion.div>
      </section>

      {/* Owner Highlight */}
      <section className="max-w-7xl mx-auto py-24 px-8">
        <div className="glass-morphism rounded-[4rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-indigo-900/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>
          
          <motion.div
            className="relative shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 p-2 bg-[var(--bg-surface)]">
              <img
                src={ownerImage}
                alt="Shaban Qazi"
                className="w-full h-full object-cover rounded-[2.5rem]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-slate-950 dark:bg-indigo-600 text-white p-5 rounded-3xl shadow-2xl flex flex-col items-center">
              <span className="text-2xl font-black leading-none">10+</span>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 dark:text-indigo-200 mt-1">Years</span>
            </div>
          </motion.div>

          <motion.div
            className="text-center md:text-left flex-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em] block mb-4">Founder & Head Trainer</span>
            <h2 className="text-5xl md:text-6xl font-black text-[var(--text-primary)] mb-8 font-premium tracking-tighter uppercase">
              Shaban Qazi
            </h2>
            <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 leading-relaxed font-medium">
              "PowerFitness is more than just a gym. We focus on real strength training, functional movements, and proper nutrition advice to help you get results."
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href="https://www.instagram.com/shabanqazi_11"
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-8 flex items-center gap-3 text-xs uppercase tracking-widest"
              >
                <FaInstagram className="text-lg" /> Instagram
              </a>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-surface)] bg-slate-200 dark:bg-slate-800" />
                ))}
                <div className="flex items-center pl-4 text-[var(--text-secondary)] text-xs font-bold">500+ Happy Members</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="max-w-7xl mx-auto py-20 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="premium-card p-10 group hover:-translate-y-2 transition-all cursor-pointer"
            onClick={() => navigate(card.link)}
          >
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700">
              {card.icon}
            </div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 font-premium uppercase tracking-tight">{card.title}</h3>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{card.desc}</p>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">
              Learn More <FaArrowRight />
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
