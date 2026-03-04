import React from "react";
import { FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white mt-20 relative overflow-hidden">
      {/* Decorative architectural lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-slate-800 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-slate-800 pointer-events-none hidden md:block"></div>
      
      <div className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          
          <div className="md:col-span-4">
            <h2 className="text-3xl font-black font-premium tracking-tighter uppercase mb-6">
              Power<span className="text-indigo-500">Fitness</span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
              Your premium fitness destination in Boisar. Start your transformation today with elite training and professional support.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Quick Links</h3>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-300">
                <li><a href="/" className="hover:text-indigo-400 transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="/fees" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="/contact" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Contact Us</h3>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-300">
                <li className="flex items-center gap-3">
                  <FaPhone className="text-indigo-500" /> 
                  <a href="tel:8080666585" className="hover:text-indigo-400">8080666585</a>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-indigo-500" /> 
                  inquire@powerfitness.com
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Social</h3>
              <a
                href="https://instagram.com/thepowerfitness001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
              >
                <FaInstagram className="text-xl group-hover:text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">@powerfitness</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © 2026 PowerFitness. All rights reserved.
          </p>
          <div className="flex gap-8 text-[9px] font-black text-slate-600 uppercase tracking-widest">
             <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
