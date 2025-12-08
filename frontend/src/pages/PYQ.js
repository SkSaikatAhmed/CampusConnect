import React, { useState, useEffect } from "react";

const PYQ = () => {
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);

  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:5000";

  // Course options based on department
  const courseOptions = {
    CSE: ["B.Tech", "M.Tech"],
    ECE: ["B.Tech", "M.Tech"],
    EE: ["B.Tech", "M.Tech"],
    ME: ["B.Tech", "M.Tech"],
    CE: ["B.Tech", "M.Tech"],
    Math: ["M.Sc"],
    Physics: ["M.Sc"],
    Chemistry: ["M.Sc"],
  };

  // Fetch PYQs
  const getPYQs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pyq/get`);
      const data = await res.json();
      setPyqs(data);
    } catch (err) {
      console.error("GET ERROR:", err);
    }
  };

  useEffect(() => {
    getPYQs();
  }, []);

  // Upload PYQ
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!department || !course || !subject || !year || !file) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("department", department);
    formData.append("course", course);
    formData.append("subject", subject);
    formData.append("year", year);
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/pyq/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (data.message === "PYQ uploaded successfully!") {
        alert("Uploaded Successfully!");

        // Reset form
        setDepartment("");
        setCourse("");
        setSubject("");
        setYear("");
        setFile(null);

        getPYQs();
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      setLoading(false);
      alert("Error uploading PYQ");
      console.error("UPLOAD ERROR:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Upload PYQ</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md"
      >

        {/* Department */}
        <label className="block mb-2">Department</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setCourse(""); // reset course on dept change
          }}
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
          <option value="Math">Math</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
        </select>

        {/* Course */}
        <label className="block mb-2">Course</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          disabled={!department}
        >
          <option value="">Select Course</option>
          {department &&
            courseOptions[department].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>

        {/* Subject */}
        <label className="block mb-2">Subject</label>
        <input
          className="w-full p-2 border rounded mb-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
        />

        {/* Year */}
        <label className="block mb-2">Year</label>
        <input
          className="w-full p-2 border rounded mb-3"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          type="number"
          placeholder="Enter year"
        />

        {/* PDF File */}
        <label className="block mb-2">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="w-full mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload PYQ"}
        </button>
      </form>

      {/* PYQ List */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">All PYQs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pyqs.map((pyq) => (
          <div key={pyq._id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold">{pyq.subject}</h3>
            <p>Department: {pyq.department}</p>
            <p>Course: {pyq.course}</p>
            <p>Year: {pyq.year}</p>

            <a
              href={`${API_URL}${pyq.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline mt-2 inline-block"
            >
              View PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PYQ;
