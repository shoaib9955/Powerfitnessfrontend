import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AddMember from "./pages/AddMember";
import MembersList from "./pages/MembersList";
import Receipt from "./pages/Receipt";
import History from "./pages/History";
import AdminFeeManagement from "./pages/AdminFeeManagement";
import Settings from "./pages/Settings";
import ManageReceipts from "./pages/ManageReceipts";
import FeeStructure from "./pages/FeeStructure";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { auth } = useContext(AuthContext);
  const userRole = auth?.role;

  // 🔹 Splash Screen State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate short delay before showing app
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Splash screen before app loads
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin"
            style={{ animationDelay: "0.15s" }}
          ></div>
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          💪 PowerFitness
        </h1>
        <p className="text-lg font-medium animate-pulse text-indigo-200">
          Preparing your experience...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Navbar userRole={userRole} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/fees" element={<FeeStructure />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />

        {/* Admin Routes */}
        <Route
          path="/add-member"
          element={
            <PrivateRoute role="admin">
              <AddMember />
            </PrivateRoute>
          }
        />
        <Route
          path="/members"
          element={
            <PrivateRoute role="admin">
              <MembersList />
            </PrivateRoute>
          }
        />
        <Route
          path="/receipt/:id"
          element={
            <PrivateRoute role="admin">
              <Receipt />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <PrivateRoute role="admin">
              <AdminFeeManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/receipts"
          element={
            <PrivateRoute role="admin">
              <ManageReceipts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <PrivateRoute role="admin">
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
