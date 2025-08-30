import React from "react";
import { FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 text-white mt-10 p-8 md:p-12 text-center overflow-hidden rounded-t-3xl shadow-xl">
      {/* Decorative glow/diamond effect */}
      <span className="absolute inset-0 bg-white/10 transform rotate-12 scale-150 opacity-20 pointer-events-none"></span>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold drop-shadow-lg">
            PowerFitness
          </h2>
          <p className="text-sm md:text-base mt-1">
            © 2025 Gym Management. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <p className="flex items-center gap-2">
            <FaEnvelope /> contact@powerfitness.com
          </p>
          <p className="flex items-center gap-2">
            <FaPhone /> +91 1234567890
          </p>
          <a
            href="https://instagram.com/powerfitness"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-yellow-300 transition"
          >
            <FaInstagram /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
