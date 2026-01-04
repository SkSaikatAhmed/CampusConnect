import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function UploadPYQ() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [showNewSubject, setShowNewSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const [form, setForm] = useState({
    program: "",
    department: "",
    branch: "",
    subject: "",
    semester: "",
    year: "",
  });

  const [file, setFile] = useState(null);

  /* ---------- FETCH META (READ ONLY) ---------- */
  useEffect(() => {
    axios.get(`${API}/api/meta/PROGRAM`).then(r => setPrograms(r.data));
    axios.get(`${API}/api/meta/DEPARTMENT`).then(r => setDepartments(r.data));
    axios.get(`${API}/api/meta/SUBJECT`).then(r => setSubjects(r.data));
  }, []);

  useEffect(() => {
    if (form.program === "MTECH" && form.department) {
      axios
        .get(`${API}/api/meta/BRANCH`, {
          params: { program: "MTECH", department: form.department },
        })
        .then(r => setBranches(r.data));
    } else {
      setBranches([]);
      setForm(f => ({ ...f, branch: "" }));
    }
  }, [form.program, form.department]);

  /* ---------- ADD NEW SUBJECT (STUDENT ALLOWED) ---------- */
  const addNewSubject = async () => {
    if (!newSubject.trim()) return;

    await axios.post(`${API}/api/meta`, {
      type: "SUBJECT",
      value: newSubject.trim(),
    });

    const res = await axios.get(`${API}/api/meta/SUBJECT`);
    setSubjects(res.data);

    setForm({ ...form, subject: newSubject.trim() });
    setNewSubject("");
    setShowNewSubject(false);
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("PDF required");
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    data.append("file", file);

    await axios.post(`${API}/api/pyq/student-upload`, data);

    alert("Uploaded successfully. Awaiting admin approval.");

    setForm({
      program: "",
      department: "",
      branch: "",
      subject: "",
      semester: "",
      year: "",
    });
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload PYQ (Student)</h2>

      {/* PROGRAM */}
      <select
        required
        value={form.program}
        onChange={e => setForm({ ...form, program: e.target.value })}
      >
        <option value="">Select Program</option>
        {programs.map(p => (
          <option key={p._id} value={p.value}>{p.value}</option>
        ))}
      </select>

      {/* DEPARTMENT */}
      <select
        required
        value={form.department}
        onChange={e => setForm({ ...form, department: e.target.value })}
      >
        <option value="">Select Department</option>
        {departments.map(d => (
          <option key={d._id} value={d.value}>{d.value}</option>
        ))}
      </select>

      {/* BRANCH */}
      {form.program === "MTECH" && (
        <select
          required
          value={form.branch}
          onChange={e => setForm({ ...form, branch: e.target.value })}
        >
          <option value="">Select Branch</option>
          {branches.map(b => (
            <option key={b._id} value={b.value}>{b.value}</option>
          ))}
        </select>
      )}

      {/* SUBJECT */}
      <select
        required
        value={form.subject}
        onChange={e => {
          if (e.target.value === "__add__") {
            setShowNewSubject(true);
          } else {
            setForm({ ...form, subject: e.target.value });
            setShowNewSubject(false);
          }
        }}
      >
        <option value="">Select Subject</option>
        {subjects.map(s => (
          <option key={s._id} value={s.value}>{s.value}</option>
        ))}
        <option value="__add__">➕ Add New Subject</option>
      </select>

      {/* ADD NEW SUBJECT UI */}
      {showNewSubject && (
        <>
          <input
            placeholder="Enter new subject"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
          />
          <button type="button" onClick={addNewSubject}>
            Add Subject
          </button>
        </>
      )}

      {/* SEMESTER */}
      <select
        required
        value={form.semester}
        onChange={e => setForm({ ...form, semester: e.target.value })}
      >
        <option value="">Select Semester</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>

      {/* YEAR */}
      <input
        type="number"
        placeholder="Year"
        required
        value={form.year}
        onChange={e => setForm({ ...form, year: e.target.value })}
      />

      {/* FILE */}
      <input
        type="file"
        accept="application/pdf"
        required
        onChange={e => setFile(e.target.files[0])}
      />

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Upload PYQ
      </button>
    </form>
  );
}

export default UploadPYQ;
