import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:4000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  const addMember = (member) => setMembers((prev) => [member, ...prev]);

  return (
    <MembersContext.Provider
      value={{ members, setMembers, loading, fetchMembers, addMember }}
    >
      {children}
    </MembersContext.Provider>
  );
};
