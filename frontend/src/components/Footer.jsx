import React from "react";
import { FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-pink-600 via-purple-800 to-indigo-900 text-white mt-12 px-6 py-14 md:px-16 text-center overflow-hidden rounded-t-3xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
      {/* Futuristic neon glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent)] blur-2xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 max-w-7xl mx-auto">
        {/* Branding */}
        <div className="text-center lg:text-left space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
            PowerFitness
          </h2>
          <p className="text-sm md:text-base text-white/80">
            © 2025 Gym Management. All rights reserved.
          </p>
        </div>

        {/* Contact + Socials */}
        <div className="flex flex-col sm:flex-row gap-6 items-center text-sm md:text-base">
          {/* Email */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition">
              <FaEnvelope className="text-yellow-300 group-hover:scale-110 transition-transform" />
            </span>
            <span className="group-hover:text-yellow-200 transition">
              contact@powerfitness.com
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition">
              <FaPhone className="text-green-300 group-hover:scale-110 transition-transform" />
            </span>
            <span className="group-hover:text-green-200 transition">
              +91 1234567890
            </span>
          </div>

          {/* Instagram */}
          <a
            href="https://instagram.com/powerfitness"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <span className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_25px_rgba(255,0,150,0.7)] transition">
              <FaInstagram className="text-pink-400 group-hover:scale-110 transition-transform" />
            </span>
            <span className="group-hover:text-pink-300 transition">
              Instagram
            </span>
          </a>
        </div>
      </div>

      {/* Subtle animated line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-400 animate-pulse"></div>
    </footer>
  );
};

export default Footer;
