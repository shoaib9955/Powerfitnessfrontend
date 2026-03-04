import React from "react";
import { motion } from "framer-motion";
import gym1 from "../assets/gym1.png";
import gym2 from "../assets/gym2.png";
import gym3 from "../assets/gym4.png";

const About = () => {
  const sections = [
    {
      title: "Our Goal",
      text: "PowerFitness is the best place in Boisar for serious training. We help you stay healthy and strong in a professional and clean gym.",
      bg: gym1,
      tag: "Mission"
    },
    {
      title: "Expert Trainers",
      text: "Our certified coaches focus on strength training and healthy living. We make sure every workout helps you reach your fitness goals.",
      bg: gym2,
      tag: "Training"
    },
    {
      title: "Great Facility",
      text: "Enjoy a gym with the best equipment and a premium look. From cardio to heavy weights, we have everything you need to get fit.",
      bg: gym3,
      tag: "Quality"
    },
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-64 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-24">
          <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em] block mb-4">About Us</span>
          <h1 className="text-6xl md:text-7xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase mb-8">
            Our <span className="text-indigo-600 dark:text-indigo-400">Story</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--text-secondary)] text-lg md:text-xl font-medium leading-relaxed">
            PowerFitness is a community where we help you become stronger and healthier through hard work and discipline.
          </p>
        </div>

        {/* Story Sections */}
        <div className="space-y-32">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}
            >
              <div className="w-full md:w-1/2 relative group">
                <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-700 opacity-10"></div>
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl z-10 aspect-video">
                  <img
                    src={section.bg}
                    alt={section.title}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                </div>
              </div>

              <div className="w-full md:w-1/2 text-center md:text-left">
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] block mb-4">{section.tag}</span>
                <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase mb-6 leading-tight">
                  {section.title}
                </h2>
                <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed font-medium">
                  {section.text}
                </p>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer Accent */}
        <div className="mt-40 text-center">
          <div className="glass-morphism py-20 px-8 rounded-[4rem]">
             <h3 className="text-3xl font-black text-[var(--text-primary)] font-premium uppercase tracking-tighter mb-4">Start Your Journey</h3>
             <p className="text-[var(--text-secondary)] font-bold text-xs uppercase tracking-[0.3em] mb-10">Visit our gym in Boisar today</p>
             <button
               onClick={() => window.location.href = '/fees'}
               className="premium-button bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 px-12 py-5 font-black uppercase text-xs tracking-widest"
             >
               Join Us Now
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
