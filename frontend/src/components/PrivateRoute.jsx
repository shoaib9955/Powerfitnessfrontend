import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);
  if (!auth.token || auth.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default PrivateRoute;
