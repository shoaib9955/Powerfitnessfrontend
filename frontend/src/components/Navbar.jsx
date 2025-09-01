import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userRole = auth?.role || "guest";
  const isLoggedIn = !!auth?.token;

  const publicLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
    { name: "Fee Structure", to: "/fees" },
  ];

  const adminLinks = [
    { name: "Manage Fees", to: "/admin/fees" },
    { name: "Add Member", to: "/add-member" },
    { name: "Members List", to: "/members" },
    { name: "History", to: "/history" },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-400/80 via-emerald-600/80 to-green-700/90 backdrop-blur-xl text-white px-6 py-4 fixed w-full z-50 shadow-lg border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Branding */}
        <h1 className="text-2xl font-extrabold tracking-widest flex items-center gap-2 relative group">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-contain drop-shadow-lg"
          />
          <span className="text-yellow-300 group-hover:text-yellow-400 transition duration-300">
            Power
          </span>
          <span className="text-white">Fitness</span>
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-500"></span>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-semibold text-lg">
          {publicLinks.map((link) => (
            <li key={link.name} className="relative group">
              <Link
                to={link.to}
                className="transition-all duration-300 hover:text-yellow-300"
              >
                {link.name}
              </Link>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-500"></span>
            </li>
          ))}

          {userRole === "admin" &&
            adminLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link
                  to={link.to}
                  className="transition-all duration-300 hover:text-yellow-300"
                >
                  {link.name}
                </Link>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 group-hover:w-full transition-all duration-500"></span>
              </li>
            ))}

          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-700 px-4 py-1 rounded-full hover:scale-110 hover:shadow-[0_0_15px_red] transition-transform duration-300"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-black px-4 py-1 rounded-full hover:scale-110 hover:shadow-[0_0_15px_gold] transition-transform duration-300"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center gap-2 text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col gap-4 mt-2 px-6 py-6 bg-gradient-to-r from-green-500/90 to-green-800/90 backdrop-blur-2xl rounded-2xl absolute right-4 top-16 w-[calc(100%-2rem)] shadow-xl border border-white/10"
          >
            {publicLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-white/10 transition"
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
                    className="block py-2 px-3 rounded hover:bg-white/10 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

            {isLoggedIn ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 rounded-full hover:shadow-[0_0_15px_red] transition"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center bg-gradient-to-r from-yellow-300 to-yellow-500 text-black px-4 py-2 rounded-full hover:shadow-[0_0_15px_gold] transition"
                >
                  Login
                </Link>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
