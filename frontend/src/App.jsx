import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AddMember from "./pages/AddMember";
import MembersList from "./pages/MembersList";
import Receipt from "./pages/Receipt";
import MemberHistory from "./pages/History";
import AdminFeeManagement from "./pages/AdminFeeManagement";
import FeeStructure from "./pages/FeeStructure";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer"; // adjust path if needed

const App = () => {
  const [userRole, setUserRole] = useState(null);

  // optional: load role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) setUserRole(role);
  }, []);

  return (
    <Router>
      <Navbar userRole={userRole} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/history" element={<MemberHistory />} />
        <Route path="/fees" element={<FeeStructure />} />
        <Route
          path="/admin/fees"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <AdminFeeManagement />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route
          path="/add-member"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <AddMember />
            </PrivateRoute>
          }
        />
        <Route
          path="/members"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <MembersList />
            </PrivateRoute>
          }
        />
        <Route
          path="/receipt/:id"
          element={
            <PrivateRoute role="admin" userRole={userRole}>
              <Receipt />
            </PrivateRoute>
          }
        />
      </Routes>
      {/* Footer at the bottom */}
      <Footer />
    </Router>
  );
};

export default App;
