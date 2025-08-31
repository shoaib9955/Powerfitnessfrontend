import React, { useContext } from "react";
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
