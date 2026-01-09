import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function PendingNotes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/notes/pending`)
      .then(res => setData(res.data));
  }, []);

  const approve = async (id) => {
    await axios.put(`${API}/api/notes/approve/${id}`);
    setData(prev => prev.filter(d => d._id !== id));
  };

  const reject = async (id) => {
    const reason = prompt("Rejection reason?");
    if (!reason) return;

    await axios.put(`${API}/api/notes/reject/${id}`, { reason });
    setData(prev => prev.filter(d => d._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Notes Uploads</h2>

      {data.map(n => (
        <div key={n._id} className="border p-4 mb-4 rounded">
          <p className="font-semibold">{n.subject}</p>
          <p>{n.program} • {n.department}</p>
          <p>Sem {n.semester} | {n.year}</p>

          <a
            href={`${API}${n.fileUrl}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View PDF
          </a>

          <div className="mt-3">
            <button
              onClick={() => approve(n._id)}
              className="bg-green-600 text-white px-3 py-1 rounded mr-2"
            >
              Approve
            </button>
            <button
              onClick={() => reject(n._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PendingNotes;
