import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-400 to-green-700 text-white px-6 py-4 shadow-2xl fixed w-full z-50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider">
          <span className="text-yellow-300">Power</span>Fitness
        </h1>

        <ul className="hidden md:flex gap-6 font-semibold text-lg">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {auth.role === "admin" && (
            <>
              <li>
                <Link to="/add-member">Add Member</Link>
              </li>
              <li>
                <Link to="/members">Members List</Link>
              </li>
              <Link to="/history">Member History</Link>

              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
          {!auth.role && (
            <li>
              <Link to="/login">Admin Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
