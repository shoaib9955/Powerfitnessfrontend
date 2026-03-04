import React from "react";
import gym5 from "../assets/gym5.jpeg";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaArrowRight } from "react-icons/fa";

const Contact = () => {
  const contactInfo = [
    {
      icon: FaEnvelope,
      label: "Digital Inquiry",
      value: "contact@powerfitness.com",
      link: "mailto:contact@powerfitness.com"
    },
    {
      icon: FaPhoneAlt,
      label: "Phone Number",
      value: "8080666585",
      link: "tel:8080666585"
    },
    {
      icon: FaInstagram,
      label: "Social Hub",
      value: "@powerfitness_boisar",
      link: "https://www.instagram.com/thepowerfitness001"
    }
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 bg-[var(--bg-main)] overflow-hidden pt-40 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full mx-auto"
        >
          <div className="premium-card rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-20 overflow-hidden relative border border-[var(--border-color)]">
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-indigo-500/10 rounded-bl-[60px] md:rounded-bl-[120px] -z-10" />
            
            <div className="text-center mb-10 md:mb-16">
              <span className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] block mb-3 md:mb-4">Support Team</span>
              <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] font-premium tracking-tight uppercase">Get in <span className="text-indigo-600 dark:text-indigo-400">Touch</span></h1>
              <p className="text-[var(--text-secondary)] font-bold text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.3em] mt-3">Member support & inquiries</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start text-left">
              <div className="space-y-6 md:space-y-10">
                {contactInfo.map((info, idx) => (
                  <a 
                    key={idx} 
                    href={info.link}
                    target={info.icon === FaInstagram ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 md:gap-6 group cursor-pointer"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-indigo-600 group-hover:text-white transition-all border border-[var(--border-color)] flex-shrink-0">
                      <info.icon className="text-lg md:text-xl" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] md:text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.1em] md:tracking-[0.2em] block mb-0.5 md:mb-1">
                        {info.label === "Digital Inquiry" ? "Email Address" : info.label === "Phone Number" ? "Contact Line" : "Connect with us"}
                      </span>
                      <span className="text-base md:text-lg font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors uppercase tracking-tight break-words">{info.value}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border border-[var(--border-color)]">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <FaMapMarkerAlt className="text-indigo-600 dark:text-indigo-400 text-xl md:text-2xl" />
                  <h3 className="text-[var(--text-primary)] font-black uppercase text-xs md:text-sm tracking-widest">Our Studios</h3>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  <div className="text-left">
                    <h4 className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-2">Power Fitness 1</h4>
                    <p className="text-[var(--text-secondary)] font-bold leading-relaxed text-sm md:text-base uppercase tracking-tight">
                      Yashwant Srushti,<br />
                      Near Rahul International,<br />
                      Boisar
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-[var(--border-color)] text-left">
                    <h4 className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-2">Power Fitness 2.0</h4>
                    <p className="text-[var(--text-secondary)] font-bold leading-relaxed text-sm md:text-base uppercase tracking-tight">
                      Tata Housing,<br />
                      Above Adhikhari Life Line,<br />
                      Boisar
                    </p>
                  </div>
                </div>

                <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-[var(--border-color)] flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                   Active Hours <FaArrowRight /> 05:00 - 22:00
                </div>
              </div>
            </div>
          </div>

          <p className="text-center mt-12 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em]">
            Official PowerFitness Communication Channel
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
