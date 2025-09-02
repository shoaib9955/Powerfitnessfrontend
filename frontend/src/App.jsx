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
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400">
        <h1 className="text-4xl font-extrabold tracking-wide">
          💪 PowerFitness
        </h1>
        <p className="mt-4 text-lg animate-pulse">Loading...</p>
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
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
