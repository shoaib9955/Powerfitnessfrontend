import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  // If not logged in, redirect to login
  if (!auth?.token) return <Navigate to="/login" replace />;

  // If a specific role is required, check it
  if (role && auth.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
