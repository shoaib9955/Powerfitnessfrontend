import React, { useEffect, useState } from "react";
import api from "../api"; // use centralized Axios instance

const AdminFeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [newPlan, setNewPlan] = useState({
    planName: "",
    amount: "",
    description: "",
    offer: "",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await api.get("/fees");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setFees(data);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
      setFees([]); // fallback
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/fees", newPlan);
      setNewPlan({ planName: "", amount: "", description: "", offer: "" });
      fetchFees();
    } catch (error) {
      console.error("Failed to add fee:", error);
      alert(error.response?.data?.message || "Failed to add fee");
    }
  };

  const handleUpdate = async (id, updatedFee) => {
    try {
      await api.put(`/fees/${id}`, updatedFee);
      fetchFees();
    } catch (error) {
      console.error("Failed to update fee:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/fees/${id}`);
      setConfirmDeleteId(null);
      fetchFees();
    } catch (error) {
      console.error("Failed to delete fee:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 md:p-20">
      {/* Add New Fee Plan Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-10 mb-30">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Add New Fee Plan
        </h2>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Plan Name"
            value={newPlan.planName}
            onChange={(e) =>
              setNewPlan({ ...newPlan, planName: e.target.value })
            }
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newPlan.amount}
            onChange={(e) => setNewPlan({ ...newPlan, amount: e.target.value })}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newPlan.description}
            onChange={(e) =>
              setNewPlan({ ...newPlan, description: e.target.value })
            }
            className="border px-3 py-2 rounded w-full col-span-2"
          />
          <input
            type="text"
            placeholder="Offer"
            value={newPlan.offer}
            onChange={(e) => setNewPlan({ ...newPlan, offer: e.target.value })}
            className="border px-3 py-2 rounded w-full col-span-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-2"
          >
            Add Plan
          </button>
        </form>
      </div>

      {/* Existing Fees Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Existing Fee Plans
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse border border-gray-300 text-left">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-2 border">Plan Name</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Offer</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <EditableRow
                  key={fee._id}
                  fee={fee}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  confirmDeleteId={confirmDeleteId}
                  setConfirmDeleteId={setConfirmDeleteId}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {fees.map((fee) => (
            <div
              key={fee._id}
              className="bg-green-50 p-4 rounded-lg shadow flex flex-col gap-2"
            >
              <p>
                <span className="font-semibold">Plan Name:</span> {fee.planName}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> {fee.amount}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {fee.description}
              </p>
              <p>
                <span className="font-semibold">Offer:</span> {fee.offer}
              </p>
              <div className="flex gap-2 mt-2">
                {confirmDeleteId === fee._id ? (
                  <>
                    <span>Are you sure?</span>
                    <button
                      onClick={() => handleDelete(fee._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      No
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(fee._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => handleUpdate(fee._id, fee)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EditableRow = ({
  fee,
  handleUpdate,
  handleDelete,
  confirmDeleteId,
  setConfirmDeleteId,
}) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...fee });

  return (
    <tr>
      <td className="px-4 py-2 border">
        {editing ? (
          <input
            value={editData.planName}
            onChange={(e) =>
              setEditData({ ...editData, planName: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          fee.planName
        )}
      </td>
      <td className="px-4 py-2 border">
        {editing ? (
          <input
            type="number"
            value={editData.amount}
            onChange={(e) =>
              setEditData({ ...editData, amount: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          fee.amount
        )}
      </td>
      <td className="px-4 py-2 border">
        {editing ? (
          <input
            value={editData.description || ""}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          fee.description
        )}
      </td>
      <td className="px-4 py-2 border">
        {editing ? (
          <input
            value={editData.offer || ""}
            onChange={(e) =>
              setEditData({ ...editData, offer: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          fee.offer
        )}
      </td>
      <td className="px-4 py-2 border flex gap-2">
        {editing ? (
          <>
            <button
              onClick={() => {
                handleUpdate(fee._id, editData);
                setEditing(false);
              }}
              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {confirmDeleteId === fee._id ? (
              <>
                <span>Are you sure?</span>
                <button
                  onClick={() => handleDelete(fee._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                >
                  No
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(fee._id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default AdminFeeManagement;
