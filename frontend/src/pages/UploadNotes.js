import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Upload,
  FileText,
  GraduationCap,
  Layers,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  FolderPlus,
  Notebook,
  PenTool,
  FileCheck,
  BookMarked
} from "lucide-react";
import API from "../api";

const BASE_URL = process.env.REACT_APP_API_URL;
// This will be: https://campusconnect-bmrw.onrender.com
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50",
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
        className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
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
        className={`w-full px-4 py-3 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
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
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300"
      >
        {fileName ? (
          <>
            <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full mb-2">
              <Notebook className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{fileName}</span>
            <span className="text-xs text-gray-500 mt-1">Click to change file</span>
          </>
        ) : (
          <>
            <div className="p-3 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full mb-2">
              <Upload className="h-6 w-6 text-emerald-600" />
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

function UploadNotes() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [noteTypes, setNoteTypes] = useState([
    "Lecture Notes",
    "Handwritten Notes",
    "Digital Notes",
    "Summary",
    "Formula Sheet",
    "Solved Examples",
    "Reference Material"
  ]);
  const [selectedNoteType, setSelectedNoteType] = useState("");

  const [form, setForm] = useState({
    program: "",
    department: "",
    branch: "",
    subject: "",
    semester: "",
    year: "",
    description: ""
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  /* META */
  useEffect(() => {
    API.get("/api/meta/PROGRAM").then(r => setPrograms(r.data));
    API.get("/api/meta/DEPARTMENT").then(r => setDepartments(r.data));
    API.get("/api/meta/SUBJECT").then(r => setSubjects(r.data));
  }, []);
  

  useEffect(() => {
    if (form.program === "MTECH" && form.department) {
      API.get("/api/meta/BRANCH", {
        params: { program: "MTECH", department: form.department }
      }).then(r => setBranches(r.data));
    } else {
      setBranches([]);
      setForm(f => ({ ...f, branch: "" }));
    }
  }, [form.program, form.department]);

  /* SUBMIT */
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
      if (selectedNoteType) {
        data.append("noteType", selectedNoteType);
      }
      data.append("file", file);

      const token = localStorage.getItem("token");

      await API.post("/api/notes/student-upload", data);

            
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
          description: ""
        });
        setSelectedNoteType("");
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="p-4 bg-gradient-to-r from-emerald-100 to-green-200 rounded-2xl inline-block mb-6">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Notes Uploaded Successfully! 📚
              </h2>
              <p className="text-gray-600 mb-6">
                Your study notes have been uploaded and are pending admin approval. 
                You'll be notified once they're approved and published for others to learn from.
              </p>
              <div className="space-y-3">
                <Link to="/notes">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Notes Library
                  </Button>
                </Link>
                <button
                  onClick={() => setUploadSuccess(false)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Upload Another Notes
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Header - CENTER ALIGNED */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center">
            <Link to="/notes" className="inline-flex items-center text-emerald-100 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notes Library
            </Link>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <BookMarked className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Upload <span className="text-amber-300">Study Notes</span>
                </h1>
                <p className="text-xl text-emerald-100 mt-3 max-w-2xl">
                  Share your knowledge and help others learn better
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
                  <AlertCircle className="h-5 w-5 mr-2 text-emerald-600" />
                  Upload Guidelines
                </h3>
                <p className="text-sm text-gray-500 mt-1">Ensure quality for better learning</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-emerald-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">File Requirements</h4>
                      <p className="text-sm text-gray-600">Upload PDF files only. Max size: 20MB.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-emerald-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Content Quality</h4>
                      <p className="text-sm text-gray-600">Ensure notes are clear, organized, and complete.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-emerald-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verification Process</h4>
                      <p className="text-sm text-gray-600">All uploads require admin approval for quality assurance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-emerald-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Academic Integrity</h4>
                      <p className="text-sm text-gray-600">Upload only your original work or properly credited materials.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Pro Tip</h4>
                      <p className="text-sm text-gray-600">
                        Include summaries, key points, and examples for maximum learning value.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Note Types */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <PenTool className="h-5 w-5 mr-2 text-emerald-600" />
                  Popular Note Types
                </h3>
                <div className="space-y-3">
                  {noteTypes.map((type, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedNoteType(type)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedNoteType === type
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-lg mr-3 ${
                          selectedNoteType === type 
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className={`font-medium ${
                          selectedNoteType === type ? 'text-emerald-700' : 'text-gray-700'
                        }`}>
                          {type}
                        </span>
                      </div>
                      {selectedNoteType === type && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedNoteType && (
                  <p className="text-sm text-emerald-600 mt-3 text-center">
                    Selected: <span className="font-semibold">{selectedNoteType}</span>
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Side - Upload Form */}
          <div className="lg:w-3/5">
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  <FolderPlus className="h-5 w-5 mr-2 text-emerald-600" />
                  Notes Details
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
                <Select
                  label="Subject"
                  icon={FileText}
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s.value}>{s.value}</option>
                  ))}
                </Select>

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

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Brief description of your notes, topics covered, key points..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all min-h-[100px]"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    Help others understand what your notes cover. Include topics, chapters, or special features.
                  </p>
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
                        Upload Notes
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    By uploading, you confirm these are your original notes or you have permission to share them.
                    Your contribution helps the learning community grow!
                  </p>
                </div>
              </form>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-emerald-600" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="font-semibold text-gray-900">What makes good study notes?</h4>
                    <p className="text-sm text-gray-600 mt-1">Clear organization, comprehensive coverage of topics, diagrams/examples, and summaries.</p>
                  </div>
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="font-semibold text-gray-900">Can I upload handwritten notes?</h4>
                    <p className="text-sm text-gray-600 mt-1">Yes! Scan handwritten notes as PDFs. Ensure they're legible and well-organized.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">How are notes verified?</h4>
                    <p className="text-sm text-gray-600 mt-1">Admins check for accuracy, completeness, and educational value before approval.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadNotes;