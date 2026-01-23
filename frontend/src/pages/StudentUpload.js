import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Upload,
  FileText,
  GraduationCap,
  Layers,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  FileUp,
  FolderPlus,
  Award
} from "lucide-react";

const API = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
// This will be: https://campusconnect-bmrw.onrender.com
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    outline: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50",
    secondary: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl",
    premium: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
  };
  
  const sizes = {
    default: "h-12 px-6 py-3 text-sm font-semibold",
    sm: "h-9 rounded-lg px-4 text-sm",
    lg: "h-14 rounded-xl px-8 text-base",
    icon: "h-12 w-12"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Input = ({ className = "", label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
          Icon ? 'pl-10' : ''
        } ${className}`}
        {...props}
      />
    </div>
  </div>
);

const Select = ({ className = "", label, icon: Icon, children, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      )}
      <select
        className={`w-full px-4 py-3 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
          Icon ? 'pl-10' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

const FileUpload = ({ onChange, fileName }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      PDF File
    </label>
    <div className="relative">
      <input
        type="file"
        accept="application/pdf"
        onChange={onChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
      >
        {fileName ? (
          <>
            <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full mb-2">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{fileName}</span>
            <span className="text-xs text-gray-500 mt-1">Click to change file</span>
          </>
        ) : (
          <>
            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full mb-2">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Choose PDF file
            </span>
            <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
            <span className="text-xs text-gray-400 mt-1">PDF up to 20MB</span>
          </>
        )}
      </label>
    </div>
  </div>
);

function UploadPYQ() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [showNewSubject, setShowNewSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [form, setForm] = useState({
    program: "",
    department: "",
    branch: "",
    subject: "",
    semester: "",
    year: "",
  });

  const [file, setFile] = useState(null);

  /* ---------- FETCH META (READ ONLY) ---------- */
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

  /* ---------- ADD NEW SUBJECT (STUDENT ALLOWED) ---------- */
  const addNewSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      await axios.post(`${API}/api/meta`, {
        type: "SUBJECT",
        value: newSubject.trim(),
      });

      const res = await axios.get(`${API}/api/meta/SUBJECT`);
      setSubjects(res.data);

      setForm({ ...form, subject: newSubject.trim() });
      setNewSubject("");
      setShowNewSubject(false);
    } catch (error) {
      alert("Failed to add subject. Please try again.");
    }
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!file) {
      alert("Please select a PDF file");
      setIsSubmitting(false);
      return;
    }

    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    if (file.size > 20 * 1024 * 1024) {
      alert("File size must be less than 20MB");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach(k => data.append(k, form[k]));
      data.append("file", file);

      const token = localStorage.getItem("token");

if (!token) {
  alert("Please login to upload PYQ");
  return;
}

await axios.post(
  `${API}/api/pyq/student-upload`,
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

            
      setUploadSuccess(true);
      
      // Reset form after successful upload
      setTimeout(() => {
        setForm({
          program: "",
          department: "",
          branch: "",
          subject: "",
          semester: "",
          year: "",
        });
        setFile(null);
        setUploadSuccess(false);
        setIsSubmitting(false);
      }, 3000);
      
    } catch (error) {
      alert("Upload failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-200 rounded-2xl inline-block mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Upload Successful! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your PYQ has been uploaded successfully and is pending admin approval. 
                You'll be notified once it's approved and published.
              </p>
              <div className="space-y-3">
                <Link to="/pyq">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to PYQ Library
                  </Button>
                </Link>
                <button
                  onClick={() => setUploadSuccess(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Upload Another PYQ
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - CENTER ALIGNED */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <Link to="/pyq" className="inline-flex items-center text-blue-100 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to PYQ Library
            </Link>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Award className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Upload <span className="text-amber-300">PYQ</span>
                </h1>
                <p className="text-xl text-blue-100 mt-3 max-w-2xl">
                  Share previous year questions with the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Instructions */}
          <div className="lg:w-2/5">
            <Card className="sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Upload Guidelines
                </h3>
                <p className="text-sm text-gray-500 mt-1">Please read before uploading</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">File Requirements</h4>
                      <p className="text-sm text-gray-600">Upload PDF files only. Max size: 20MB.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quality Standards</h4>
                      <p className="text-sm text-gray-600">Ensure the PDF is clear, readable, and complete.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verification Process</h4>
                      <p className="text-sm text-gray-600">All uploads require admin approval before publishing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Community Contribution</h4>
                      <p className="text-sm text-gray-600">Your upload helps thousands of students prepare better.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Pro Tip</h4>
                      <p className="text-sm text-gray-600">
                        Include the complete question paper with answer keys if available.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* FAQ Section - Moved to left sidebar since stats removed */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <FileUp className="h-5 w-5 mr-2 text-blue-600" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="font-semibold text-gray-900">How long does approval take?</h4>
                    <p className="text-sm text-gray-600 mt-1">Typically 24-48 hours. You'll be notified via email once approved.</p>
                  </div>
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="font-semibold text-gray-900">What if my upload is rejected?</h4>
                    <p className="text-sm text-gray-600 mt-1">You'll receive feedback and can resubmit with corrections.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Can I upload solution PDFs?</h4>
                    <p className="text-sm text-gray-600 mt-1">Yes! Solutions are highly appreciated by the community.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Upload Form */}
          <div className="lg:w-3/5">
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  <FolderPlus className="h-5 w-5 mr-2 text-blue-600" />
                  PYQ Details
                </h3>
                <p className="text-sm text-gray-600 mt-1">Fill in all required information</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Program */}
                <Select
                  label="Program"
                  icon={GraduationCap}
                  required
                  value={form.program}
                  onChange={e => setForm({ ...form, program: e.target.value })}
                >
                  <option value="">Select Program</option>
                  {programs.map(p => (
                    <option key={p._id} value={p.value}>{p.value}</option>
                  ))}
                </Select>

                {/* Department */}
                <Select
                  label="Department"
                  icon={Layers}
                  required
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d._id} value={d.value}>{d.value}</option>
                  ))}
                </Select>

                {/* Branch (Only for MTECH) */}
                {form.program === "MTECH" && (
                  <Select
                    label="Branch"
                    icon={BookOpen}
                    required
                    value={form.branch}
                    onChange={e => setForm({ ...form, branch: e.target.value })}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => (
                      <option key={b._id} value={b.value}>{b.value}</option>
                    ))}
                  </Select>
                )}

                {/* Subject */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subject
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      value={form.subject}
                      onChange={e => {
                        if (e.target.value === "__add__") {
                          setShowNewSubject(true);
                        } else {
                          setForm({ ...form, subject: e.target.value });
                          setShowNewSubject(false);
                        }
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s._id} value={s.value}>{s.value}</option>
                      ))}
                      <option value="__add__" className="text-blue-600 font-semibold">
                        + Add New Subject
                      </option>
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Add New Subject UI */}
                {showNewSubject && (
                  <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Plus className="h-4 w-4 mr-2 text-blue-600" />
                        Add New Subject
                      </h4>
                      <Input
                        icon={FileText}
                        placeholder="Enter new subject name"
                        value={newSubject}
                        onChange={e => setNewSubject(e.target.value)}
                      />
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="success"
                          onClick={addNewSubject}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Add Subject
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowNewSubject(false);
                            setNewSubject("");
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Semester and Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Semester"
                    icon={Calendar}
                    required
                    value={form.semester}
                    onChange={e => setForm({ ...form, semester: e.target.value })}
                  >
                    <option value="">Select Semester</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                    ))}
                  </Select>

                  <Input
                    label="Year"
                    icon={Clock}
                    type="number"
                    placeholder="e.g., 2023"
                    required
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    min="2000"
                    max="2024"
                  />
                </div>

                {/* File Upload */}
                <FileUpload
                  onChange={e => setFile(e.target.files[0])}
                  fileName={file?.name}
                />

                {/* Upload Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    variant={isSubmitting ? "secondary" : "premium"}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Upload PYQ
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    By uploading, you confirm this content follows academic guidelines and is your work or freely shared.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPYQ;