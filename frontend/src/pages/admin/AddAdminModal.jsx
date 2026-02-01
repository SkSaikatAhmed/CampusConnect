import { useState } from "react";
import API from "../../api";

const AddAdminModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleAddAdmin = async () => {
    if (!name || !registrationNo || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/api/admin/create-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        name,
        registrationNo,
        email,
        password,
      });

      alert("Admin created successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Add admin error:", err);
      alert(err.response?.data?.error || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Admin</h2>

        <input
          type="text"
          placeholder="Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="text"
          placeholder="Registration No (e.g. ADM2025_001)"
          value={registrationNo}
          onChange={(e) => setRegistrationNo(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleAddAdmin}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
