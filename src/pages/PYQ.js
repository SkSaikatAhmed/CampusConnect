import React, { useEffect, useState } from "react";

const PYQ = () => {
  const [pyqs, setPyqs] = useState([]);

  useEffect(() => {
    // Fetch from backend (optional)
    const fetchPYQ = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pyq/get");
        const data = await res.json();
        setPyqs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPYQ();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Previous Year Questions (PYQ)
      </h1>

      {pyqs.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No PYQs uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqs.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.subject}
              </h2>

              <p className="text-gray-600 mb-4">Year: {item.year}</p>

              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View / Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PYQ;
