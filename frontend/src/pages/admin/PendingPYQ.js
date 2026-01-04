import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function PendingPYQ() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(`${API}/api/pyq/pending`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching pending uploads", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const approve = async (id) => {
    await axios.put(`${API}/api/pyq/approve/${id}`);
    setData(prev => prev.filter(d => d._id !== id));
  };

  const reject = async (id) => {
    const reason = prompt("Rejection reason?");
    if (!reason) return;

    await axios.put(`${API}/api/pyq/reject/${id}`, { reason });
    setData(prev => prev.filter(d => d._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Pending Student Uploads
      </h2>

      {loading && <p>Loading pending uploads...</p>}

      {!loading && data.length === 0 && (
        <p className="text-gray-600">No pending uploads.</p>
      )}

      {!loading &&
        data.map(p => (
          <div
            key={p._id}
            className="border rounded-lg p-4 mb-4 bg-white shadow"
          >
            <p className="font-semibold text-lg">
              {p.subject}
            </p>

            <p className="text-sm text-gray-600">
              {p.program} • {p.department}
              {p.branch && ` • ${p.branch}`}
            </p>

            <p className="text-sm">
              Semester {p.semester}, Year {p.year}
            </p>

            <a
              href={`${API}${p.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-blue-600 underline"
            >
              View PDF
            </a>

            <div className="mt-4">
              <button
                onClick={() => approve(p._id)}
                className="bg-green-600 text-white px-4 py-1 rounded mr-3"
              >
                Approve
              </button>

              <button
                onClick={() => reject(p._id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default PendingPYQ;
