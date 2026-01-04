import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function UploadPYQ() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    program: "",
    department: "",
    branch: "",
    subject: "",
    semester: "",
    year: "",
  });

  const [file, setFile] = useState(null);

  // add-new states
  const [showAdd, setShowAdd] = useState({
    program: false,
    department: false,
    branch: false,
    subject: false,
  });

  const [newValue, setNewValue] = useState("");

  /* ---------- FETCH META ---------- */
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

  /* ---------- ADD META ---------- */
  const addMeta = async (type, extra = {}) => {
    if (!newValue) return;

    await axios.post(`${API}/api/meta`, {
      type,
      value: newValue,
      ...extra,
    });

    const res = await axios.get(`${API}/api/meta/${type}`, {
      params: extra,
    });

    if (type === "PROGRAM") setPrograms(res.data);
    if (type === "DEPARTMENT") setDepartments(res.data);
    if (type === "SUBJECT") setSubjects(res.data);
    if (type === "BRANCH") setBranches(res.data);

    setNewValue("");
    setShowAdd({ ...showAdd, [type.toLowerCase()]: false });
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

    await axios.post(`${API}/api/pyq/upload`, data);
    alert("PYQ Uploaded Successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Upload PYQ</h2>

      {/* PROGRAM */}
      <select
        required
        onChange={e =>
          e.target.value === "__add__"
            ? setShowAdd({ ...showAdd, program: true })
            : setForm({ ...form, program: e.target.value })
        }
      >
        <option value="">Select Program</option>
        {programs.map(p => (
          <option key={p._id} value={p.value}>{p.value}</option>
        ))}
        <option value="__add__">➕ Add New Program</option>
      </select>

      {showAdd.program && (
        <>
          <input placeholder="New Program" onChange={e => setNewValue(e.target.value)} />
          <button type="button" onClick={() => addMeta("PROGRAM")}>Add</button>
        </>
      )}

      {/* DEPARTMENT */}
      <select
        required
        onChange={e =>
          e.target.value === "__add__"
            ? setShowAdd({ ...showAdd, department: true })
            : setForm({ ...form, department: e.target.value })
        }
      >
        <option value="">Select Department</option>
        {departments.map(d => (
          <option key={d._id} value={d.value}>{d.value}</option>
        ))}
        <option value="__add__">➕ Add New Department</option>
      </select>

      {showAdd.department && (
        <>
          <input placeholder="New Department" onChange={e => setNewValue(e.target.value)} />
          <button type="button" onClick={() => addMeta("DEPARTMENT")}>Add</button>
        </>
      )}

      {/* BRANCH (MTECH ONLY) */}
      {form.program === "MTECH" && (
        <>
          <select
            required
            onChange={e =>
              e.target.value === "__add__"
                ? setShowAdd({ ...showAdd, branch: true })
                : setForm({ ...form, branch: e.target.value })
            }
          >
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b._id} value={b.value}>{b.value}</option>
            ))}
            <option value="__add__">➕ Add New Branch</option>
          </select>

          {showAdd.branch && (
            <>
              <input placeholder="New Branch" onChange={e => setNewValue(e.target.value)} />
              <button
                type="button"
                onClick={() =>
                  addMeta("BRANCH", {
                    program: "MTECH",
                    department: form.department,
                  })
                }
              >
                Add
              </button>
            </>
          )}
        </>
      )}

      {/* SUBJECT */}
      <select
        required
        onChange={e =>
          e.target.value === "__add__"
            ? setShowAdd({ ...showAdd, subject: true })
            : setForm({ ...form, subject: e.target.value })
        }
      >
        <option value="">Select Subject</option>
        {subjects.map(s => (
          <option key={s._id} value={s.value}>{s.value}</option>
        ))}
        <option value="__add__">➕ Add New Subject</option>
      </select>

      {showAdd.subject && (
        <>
          <input placeholder="New Subject" onChange={e => setNewValue(e.target.value)} />
          <button type="button" onClick={() => addMeta("SUBJECT")}>Add</button>
        </>
      )}

      {/* SEMESTER */}
      <select required onChange={e => setForm({ ...form, semester: e.target.value })}>
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
        onChange={e => setForm({ ...form, year: e.target.value })}
      />

      {/* FILE */}
      <input type="file" accept="application/pdf" required onChange={e => setFile(e.target.files[0])} />

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Upload PYQ
      </button>
    </form>
  );
}

export default UploadPYQ;
