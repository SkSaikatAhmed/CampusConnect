import { useState } from "react";
import axios from "../api";

function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    registrationNo: "",
    program: "",
    department: "",
    branch: "",
  });

  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    if (file) data.append("profilePhoto", file);

    await axios.post("/api/auth/register", data);
    alert("Registration successful. Please login.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Student Registration</h2>

      <input required placeholder="Full Name"
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input required placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })} />

      <input required placeholder="Password" type="password"
        onChange={e => setForm({ ...form, password: e.target.value })} />

      <input required placeholder="Registration Number"
        onChange={e => setForm({ ...form, registrationNo: e.target.value })} />

      <select onChange={e => setForm({ ...form, program: e.target.value })}>
        <option value="">Program (optional)</option>
        <option>BTECH</option>
        <option>MTECH</option>
        <option>MCA</option>
        <option>MBA</option>
      </select>

      <input placeholder="Department (optional)"
        onChange={e => setForm({ ...form, department: e.target.value })} />

      {form.program === "MTECH" && (
        <input placeholder="Branch"
          onChange={e => setForm({ ...form, branch: e.target.value })} />
      )}

      <input type="file" accept="image/*"
        onChange={e => setFile(e.target.files[0])} />

      <button className="bg-blue-600 text-white px-4 py-2 mt-4">
        Register
      </button>
    </form>
  );
}

export default StudentRegister;
