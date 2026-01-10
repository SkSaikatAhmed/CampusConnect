import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function AdminUpload({ type }) {
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
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      axios.get(`${API}/api/meta/BRANCH`, {
        params: { program: "MTECH", department: form.department },
      }).then(r => setBranches(r.data));
    } else {
      setBranches([]);
      setForm(f => ({ ...f, branch: "" }));
    }
  }, [form.program, form.department]);

  /* ---------- ADD META ---------- */
  const addMeta = async (metaType, extra = {}) => {
    if (!newValue.trim()) return;

    setIsLoading(true);
    try {
      await axios.post(`${API}/api/meta`, {
        type: metaType,
        value: newValue.trim(),
        ...extra,
      });

      const res = await axios.get(`${API}/api/meta/${metaType}`, {
        params: extra,
      });

      if (metaType === "PROGRAM") setPrograms(res.data);
      if (metaType === "DEPARTMENT") setDepartments(res.data);
      if (metaType === "SUBJECT") setSubjects(res.data);
      if (metaType === "BRANCH") setBranches(res.data);

      // Auto-select the newly added value
      if (metaType === "PROGRAM") setForm({ ...form, program: newValue.trim() });
      if (metaType === "DEPARTMENT") setForm({ ...form, department: newValue.trim() });
      if (metaType === "SUBJECT") setForm({ ...form, subject: newValue.trim() });
      if (metaType === "BRANCH") setForm({ ...form, branch: newValue.trim() });

      setNewValue("");
      setShowAdd({ ...showAdd, [metaType.toLowerCase()]: false });
    } catch (error) {
      alert("Failed to add new item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file to upload");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const data = new FormData();
      Object.keys(form).forEach(k => data.append(k, form[k]));
      data.append("file", file);

      await axios.post(`${API}/api/${type}/upload`, data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        alert(`${type.toUpperCase()} uploaded successfully!`);
        
        setForm({
          program: "",
          department: "",
          branch: "",
          subject: "",
          semester: "",
          year: "",
        });
        setFile(null);
        setFileName("");
        setUploadProgress(0);
        setIsLoading(false);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      alert(`Upload failed: ${error.message}`);
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "__add__") {
      setShowAdd({ ...showAdd, [name]: true });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Upload Portal</h1>
              <p className="text-gray-600 mt-1">Upload {type.toUpperCase()} files with academic metadata</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`px-4 py-2 rounded-full font-medium ${type === 'pyq' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {type.toUpperCase()} Upload
            </div>
            <div className="ml-4 text-sm text-gray-500">
              <span className="font-medium">Allowed:</span> PDF files only • Max 10MB
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Academic Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">Academic Information</h2>
              
              {/* PROGRAM */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Program <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                    </svg>
                  </div>
                  <select
                    name="program"
                    required
                    value={form.program}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition duration-200"
                  >
                    <option value="">Select Program</option>
                    {programs.map(p => (
                      <option key={p._id} value={p.value}>{p.value}</option>
                    ))}
                    <option value="__add__">➕ Add New Program</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* DEPARTMENT */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <select
                    name="department"
                    required
                    value={form.department}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition duration-200"
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d._id} value={d.value}>{d.value}</option>
                    ))}
                    <option value="__add__">➕ Add New Department</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* BRANCH (MTECH) */}
              {form.program === "MTECH" && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <select
                      name="branch"
                      required
                      value={form.branch}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition duration-200"
                    >
                      <option value="">Select Branch</option>
                      {branches.map(b => (
                        <option key={b._id} value={b.value}>{b.value}</option>
                      ))}
                      <option value="__add__">➕ Add New Branch</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Subject & File Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">Subject & File Details</h2>
              
              {/* SUBJECT */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition duration-200"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s._id} value={s.value}>{s.value}</option>
                    ))}
                    <option value="__add__">➕ Add New Subject</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* SEMESTER & YEAR */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <select
                      name="semester"
                      required
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition duration-200"
                    >
                      <option value="">Select Semester</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      type="number"
                      min="2000"
                      max={currentYear + 5}
                      placeholder="e.g., 2024"
                      required
                      value={form.year}
                      onChange={e => setForm({ ...form, year: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  PDF File <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 ${fileName ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {fileName ? (
                          <>
                            <svg className="w-12 h-12 mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="mb-1 text-sm text-gray-700 font-medium">{fileName}</p>
                            <p className="text-xs text-gray-500">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF only (MAX. 10MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Item Forms */}
          {Object.values(showAdd).some(v => v) && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Add New Item</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder={`Enter new ${Object.keys(showAdd).find(key => showAdd[key])} name`}
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="flex-1 border border-blue-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && addMeta(Object.keys(showAdd).find(key => showAdd[key]).toUpperCase(), 
                    showAdd.branch ? { program: "MTECH", department: form.department } : {})}
                />
                <button
                  type="button"
                  onClick={() => addMeta(
                    Object.keys(showAdd).find(key => showAdd[key]).toUpperCase(),
                    showAdd.branch ? { program: "MTECH", department: form.department } : {}
                  )}
                  disabled={!newValue.trim() || isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdd({ program: false, department: false, branch: false, subject: false });
                    setNewValue("");
                  }}
                  className="text-gray-600 hover:text-gray-800 font-medium py-3 px-4 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading {type.toUpperCase()}...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  Upload {type.toUpperCase()} Document
                </div>
              )}
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              Make sure all information is correct before uploading. Once uploaded, the file cannot be edited.
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-lg">
            <div className="text-2xl font-bold">{programs.length}</div>
            <div className="text-sm opacity-90">Programs</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-5 shadow-lg">
            <div className="text-2xl font-bold">{departments.length}</div>
            <div className="text-sm opacity-90">Departments</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-5 shadow-lg">
            <div className="text-2xl font-bold">{subjects.length}</div>
            <div className="text-sm opacity-90">Subjects</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-5 shadow-lg">
            <div className="text-2xl font-bold">{branches.length}</div>
            <div className="text-sm opacity-90">Branches</div>
          </div>
        </div>

        {/* Recent Uploads (Placeholder) */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Uploads</h3>
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>No recent uploads. Upload your first document!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;