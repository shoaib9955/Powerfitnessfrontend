import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to home
  };

  const userRole = auth.role;

  return (
    <nav className="bg-gradient-to-r from-green-400 to-green-700 text-white px-6 py-4 fixed w-full z-50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-yellow-300">Power</span>Fitness
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-semibold text-lg">
          {["Home", "About", "Contact", "Fee Structure"].map((item) => (
            <li key={item}>
              <Link
                to={
                  item === "Home"
                    ? "/"
                    : item === "About"
                    ? "/about"
                    : item === "Contact"
                    ? "/contact"
                    : "/fees"
                }
                className="transition-transform duration-300 hover:scale-110"
              >
                {item}
              </Link>
            </li>
          ))}

          {/* Admin Links */}
          {userRole === "admin" &&
            [
              { name: "Manage Fees", link: "/admin/fees" },
              { name: "Add Member", link: "/add-member" },
              { name: "Members List", link: "/members" },
              { name: "History", link: "/history" },
            ].map((admin) => (
              <li key={admin.name}>
                <Link
                  to={admin.link}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  {admin.name}
                </Link>
              </li>
            ))}

          {/* Login / Logout */}
          {auth.token ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-transform duration-300"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-transform duration-300"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex items-center gap-2 text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.ul
        initial={{ opacity: 0, y: -20 }}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="md:hidden flex flex-col gap-4 mt-2 px-6 py-4 bg-gradient-to-r from-yellow-300 to-red-700/20 backdrop-blur-xl rounded-2xl absolute right-4 top-16"
      >
        {["Home", "About", "Contact", "Fee Structure"].map((item) => (
          <li key={item}>
            <Link
              to={
                item === "Home"
                  ? "/"
                  : item === "About"
                  ? "/about"
                  : item === "Contact"
                  ? "/contact"
                  : "/fees"
              }
              className="block py-2 px-3 rounded hover:bg-white/20"
            >
              {item}
            </Link>
          </li>
        ))}

        {userRole === "admin" &&
          [
            { name: "Manage Fees", link: "/admin/fees" },
            { name: "Add Member", link: "/add-member" },
            { name: "Members List", link: "/members" },
            { name: "History", link: "/history" },
          ].map((admin) => (
            <li key={admin.name}>
              <Link
                to={admin.link}
                className="block py-2 px-3 rounded hover:bg-white/20"
              >
                {admin.name}
              </Link>
            </li>
          ))}

        {auth.token ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 w-full"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-300 w-full"
            >
              Login
            </Link>
          </li>
        )}
      </motion.ul>
    </nav>
  );
};

export default Navbar;
