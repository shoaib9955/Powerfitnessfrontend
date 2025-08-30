import React from "react";
import gym5 from "../assets/gym5.jpeg"; // Make sure gym5.jpeg is in your assets

const Contact = () => (
  <div
    className="pt-24 flex flex-col items-center justify-center min-h-screen text-center relative"
    style={{
      backgroundImage: `url(${gym5})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <div className="relative z-10 max-w-xl px-6 py-12 rounded-3xl bg-white/10 backdrop-blur-md shadow-lg">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.7)]">
        Contact Us
      </h1>

      <p className="text-white text-lg mb-2">
        <span className="font-semibold">Email:</span>{" "}
        <a
          href="mailto:contact@powerfitness.com"
          className="underline hover:text-yellow-300"
        >
          contact@powerfitness.com
        </a>
      </p>

      <p className="text-white text-lg mb-2">
        <span className="font-semibold">Phone:</span>{" "}
        <a href="tel:+911234567890" className="underline hover:text-yellow-300">
          +91 1234567890
        </a>
      </p>

      <p className="text-white text-lg mb-2">
        <span className="font-semibold">Address:</span> 123 Power Fitness
        Street, Boisar, Maharashtra, India
      </p>

      <p className="text-white text-lg mt-4">
        <span className="font-semibold">Instagram:</span>{" "}
        <a
          href="https://www.instagram.com/thepowerfitness001?igsh=MWJhdHo5b3BzYzl0Zg=="
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-yellow-300"
        >
          @powerfitness
        </a>
      </p>
    </div>
  </div>
);

export default Contact;
