import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import authService from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    role: "guest",
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.getMe();
        setAuth({ user: data.user, role: data.user.role, loading: false });
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setAuth({ user: null, role: "guest", loading: false });
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem("role", userData.role);
    setAuth({ user: userData.user, role: userData.role, loading: false });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("role");
    setAuth({ user: null, role: "guest", loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
