import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

function Notes() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filters, setFilters] = useState({});
  const [notes, setNotes] = useState([]);

  /* -------- FETCH META -------- */
  useEffect(() => {
    axios.get(`${API}/api/meta/PROGRAM`).then(r => setPrograms(r.data));
    axios.get(`${API}/api/meta/DEPARTMENT`).then(r => setDepartments(r.data));
    axios.get(`${API}/api/meta/SUBJECT`).then(r => setSubjects(r.data));
  }, []);

  useEffect(() => {
    if (filters.program === "MTECH" && filters.department) {
      axios.get(`${API}/api/meta/BRANCH`, {
        params: { program: "MTECH", department: filters.department }
      }).then(r => setBranches(r.data));
    } else {
      setBranches([]);
    }
  }, [filters.program, filters.department]);

  /* -------- FETCH NOTES -------- */
  const fetchNotes = async () => {
    const res = await axios.get(`${API}/api/notes/filter`, { params: filters });
    setNotes(res.data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notes</h2>

        <Link
          to="/notes/upload"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Upload Notes
        </Link>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <select onChange={e => setFilters({ ...filters, program: e.target.value })}>
          <option value="">Program</option>
          {programs.map(p => (
            <option key={p._id} value={p.value}>{p.value}</option>
          ))}
        </select>

        <select onChange={e => setFilters({ ...filters, department: e.target.value })}>
          <option value="">Department</option>
          {departments.map(d => (
            <option key={d._id} value={d.value}>{d.value}</option>
          ))}
        </select>

        {filters.program === "MTECH" && (
          <select onChange={e => setFilters({ ...filters, branch: e.target.value })}>
            <option value="">Branch</option>
            {branches.map(b => (
              <option key={b._id} value={b.value}>{b.value}</option>
            ))}
          </select>
        )}

        <select onChange={e => setFilters({ ...filters, subject: e.target.value })}>
          <option value="">Subject</option>
          {subjects.map(s => (
            <option key={s._id} value={s.value}>{s.value}</option>
          ))}
        </select>

        <select onChange={e => setFilters({ ...filters, semester: e.target.value })}>
          <option value="">Semester</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchNotes}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply Filter
      </button>

      {/* NOTES CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        {notes.map(n => (
          <div key={n._id} className="p-4 bg-white shadow rounded">
            <h3 className="font-bold">{n.subject}</h3>
            <p>{n.program} - {n.department}</p>
            <p>Year: {n.year} | Sem: {n.semester}</p>

            <a
              href={`${API}${n.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              View Notes
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
