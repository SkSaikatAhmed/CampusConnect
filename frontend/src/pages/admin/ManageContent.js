import { useEffect, useState } from "react";
import axios from "axios";

function ManageContent() {
  const [pyqs, setPyqs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/pyq/get")
      .then(res => setPyqs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All PYQs</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Dept</th>
            <th>Year</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {pyqs.map(p => (
            <tr key={p._id}>
              <td>{p.subject}</td>
              <td>{p.department}</td>
              <td>{p.year}</td>
              <td>
                <a href={`http://localhost:5000${p.fileUrl}`} target="_blank">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageContent;
