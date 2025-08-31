import axios from "axios";

const api = axios.create({
  baseURL: "https://powerfitnessbackend.vercel.app/api", // updated for Vercel backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
