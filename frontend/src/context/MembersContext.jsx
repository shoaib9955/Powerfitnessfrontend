import { createContext, useState } from "react";
import api from "../api";

export const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all members from backend
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/members");
      setMembers(res.data); // assuming backend returns array of members
    } catch (err) {
      console.error("Fetch Members Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMember = (member) => setMembers((prev) => [member, ...prev]);
  const removeMember = (id) =>
    setMembers((prev) => prev.filter((m) => m._id !== id));
  const updateMember = (updatedMember) =>
    setMembers((prev) =>
      prev.map((m) => (m._id === updatedMember._id ? updatedMember : m))
    );

  return (
    <MembersContext.Provider
      value={{
        members,
        loading,
        fetchMembers,
        addMember,
        removeMember,
        updateMember,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};
