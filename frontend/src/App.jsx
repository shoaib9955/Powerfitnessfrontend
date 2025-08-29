import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AddMember from "./pages/AddMember";
import MembersList from "./pages/MembersList";
import Receipt from "./pages/Receipt";
import PrivateRoute from "./components/PrivateRoute";
import MemberHistory from "./pages/HistoryList";
const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Navbar userRole={userRole} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/history" element={<MemberHistory />} />

        <Route
          path="/login"
          element={<Login setUserRole={setUserRole} setToken={setToken} />}
        />
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
    </Router>
  );
};

export default App;
