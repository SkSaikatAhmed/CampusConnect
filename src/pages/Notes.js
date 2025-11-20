import React, { useState } from "react";

function Notes() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!title || !subject || !file) {
      alert("Please fill all required fields!");
      return;
    }

    alert("Note uploaded (backend will be added later)");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">
        Upload Notes
      </h1>

      {/* Upload Form */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        
        {/* Title */}
        <div className="mb-4">
          <label className="font-medium">Title *</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className="font-medium">Subject *</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter subject name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="font-medium">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-md"
            rows="3"
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="font-medium">Upload PDF *</label>
          <input
            type="file"
            accept="application/pdf"
            className="mt-1"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition-all"
        >
          Upload Notes
        </button>
      </div>

      {/* Uploaded Notes Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Available Notes</h2>

        <p className="text-gray-500">
          (After backend, uploaded notes will appear here…)
        </p>
      </div>

    </div>
  );
}

export default Notes;
