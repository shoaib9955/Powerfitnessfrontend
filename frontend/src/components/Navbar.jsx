import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userRole = auth?.role || "guest";
  const isLoggedIn = !!auth?.token;

  const publicLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Pricing", to: "/fees" },
    { name: "Contact", to: "/contact" },
  ];

  const adminLinks = [
    { name: "Manage Fees", to: "/admin/fees" },
    { name: "Add Member", to: "/add-member" },
    { name: "Members List", to: "/members" },
    { name: "Manage Receipts", to: "/admin/receipts" },
    { name: "History", to: "/history" },
    { name: "Settings", to: "/admin/settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto glass-morphism rounded-[2rem] px-8 py-4 flex justify-between items-center shadow-indigo-100/20 shadow-2xl">
        <h1 
          className="text-2xl font-black tracking-tight flex items-center gap-5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center p-2 shadow-lg shadow-slate-200 mr-2">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em]">Power</span>
            <span className="text-slate-900 dark:text-white font-premium tracking-tighter">Fitness</span>
          </div>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-end">
          <ul className="flex items-center gap-3 xl:gap-4 font-bold text-[10px] uppercase tracking-wider text-slate-500">
            {publicLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  className="transition-colors duration-300 hover:text-indigo-600 whitespace-nowrap"
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {userRole === "admin" && (
              <div className="flex items-center gap-3 xl:gap-4 border-l border-slate-200 pl-3 xl:pl-4">
                {adminLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="transition-colors duration-300 hover:text-indigo-600 whitespace-nowrap"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </div>
            )}
          </ul>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 shrink-0" />

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {isDark ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="premium-button !py-2 !px-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 shadow-none text-[9px] font-black uppercase tracking-widest whitespace-nowrap shrink-0"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="premium-button !py-2 !px-5 bg-slate-950 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 text-[9px] font-black uppercase tracking-widest whitespace-nowrap shrink-0"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Group */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
          >
            {isDark ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 mx-2 glass-morphism rounded-[2.5rem] overflow-hidden shadow-2xl border border-white p-8"
          >
            <ul className="flex flex-col gap-6 font-black text-sm uppercase tracking-widest text-slate-500">
              {publicLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-indigo-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {userRole === "admin" &&
                adminLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="block hover:text-indigo-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}

              <div className="pt-4 border-t border-slate-100">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="premium-button w-full bg-rose-50 text-rose-600"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="premium-button w-full bg-slate-950 text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
