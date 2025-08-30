import React from "react";
import { motion } from "framer-motion";
import gym1 from "../assets/gym1.png";
import gym2 from "../assets/gym2.png";
import gym3 from "../assets/gym4.png";

const About = () => {
  const paragraphs = [
    {
      text: `Welcome to PowerFitness – the premier fitness destination in Boisar. 
      Our mission is to help you achieve your health and fitness goals in a safe, motivating, 
      and highly professional environment. Our gym is fully equipped with the latest state-of-the-art 
      machines, free weights, and cardio equipment. We maintain the highest standards of hygiene, 
      ensuring a clean and welcoming space for all members.`,
      bg: gym1,
    },
    {
      text: `At PowerFitness, our team of certified trainers is dedicated to guiding you through 
      personalized fitness programs. Whether your goal is weight loss, muscle building, or overall wellness, 
      our trainers provide expert guidance while maintaining discipline and safety. 
      We emphasize consistency, motivation, and holistic training, so you can achieve long-term results.`,
      bg: gym2,
    },
    {
      text: `Our facilities include a spacious workout area, clean locker rooms, and modern equipment to 
      ensure you have the best fitness experience. PowerFitness is committed to creating a supportive 
      community where members feel empowered, inspired, and encouraged to push their limits. 
      Come experience the best gym in Boisar, where your fitness journey becomes an enjoyable lifestyle.`,
      bg: gym3,
    },
  ];

  return (
    <div className="pt-24 flex flex-col gap-8 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-400 animate-gradient-x opacity-30"></div>

      {/* Floating Glowing Shapes */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full top-10 left-10 animate-spin-slow blur-3xl"></div>
      <div className="absolute w-64 h-64 bg-white/20 rounded-full bottom-20 right-20 animate-ping-slow blur-2xl"></div>
      <div className="absolute w-48 h-48 bg-white/10 rounded-full top-1/3 right-1/4 animate-spin-slow blur-2xl"></div>

      {/* Section Title */}
      <h1 className="relative inline-block text-center mb-12 z-10">
        {/* Diamond Box Around Text */}
        <span
          className="absolute inset-0 mx-auto my-auto w-full h-full bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400
          transform rotate-45 rounded-lg opacity-30 animate-pulse -z-10"
        ></span>

        {/* Text */}
        <span
          className="relative inline-block text-4xl md:text-6xl font-extrabold text-white tracking-wider drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-green-400 to-yellow-300 animate-gradient-x">
            PowerFitness
          </span>
        </span>
      </h1>

      {/* Paragraph Sections */}
      <div className="flex flex-col gap-6 z-10 relative">
        {paragraphs.map((para, index) => (
          <section
            key={index}
            className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center text-center px-4 overflow-hidden rounded-3xl shadow-lg"
            style={{
              backgroundImage: `url(${para.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Animated Text */}
            <motion.p
              className="relative z-10 max-w-3xl text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-bold px-4"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, delay: index * 0.4 }}
              style={{
                textShadow:
                  "0 0 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.4)",
              }}
            >
              {para.text}
            </motion.p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default About;
