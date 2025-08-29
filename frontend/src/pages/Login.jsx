import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        formData
      );

      // Save user info in context & localStorage
      login(res.data);

      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/add-member");
      } else {
        navigate("/"); // normal user goes to home page
      }
    } catch (err) {
      console.error(err);
      alert("Login failed: check username/password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-4"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
