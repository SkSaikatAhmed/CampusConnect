import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function ManageNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/notes/get`)
      .then(res => setNotes(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Notes</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Department</th>
            <th>Year</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(n => (
            <tr key={n._id}>
              <td>{n.subject}</td>
              <td>{n.department}</td>
              <td>{n.year}</td>
              <td>
                <a
                  href={`${API}${n.fileUrl}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageNotes;
