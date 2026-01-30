import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  ChevronDown,
  Layers,
  FileText,
  Award,
  RefreshCw,
  Sparkles,
  Database,
  X
} from "lucide-react";

import API from "../api";
const BASE_URL = process.env.REACT_APP_API_URL;
// This will be: https://campusconnect-bmrw.onrender.com

const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    outline: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50",
    secondary: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl",
    premium: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl"
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

const Card = ({ children, className = "", hover = true }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''} transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200",
    secondary: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200",
    success: "bg-gradient-to-r from-green-100 to-emerald-200 text-emerald-800 border border-emerald-200",
    warning: "bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 border border-amber-200",
    dark: "bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

function PYQ() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [pyqs, setPyqs] = useState([]);
  const [allPyqs, setAllPyqs] = useState([]); // Store all PYQs for search
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    downloads: 0,
    departments: 0
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle download


  // Fetch initial data and all PYQs on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch meta data
        const [programsRes, departmentsRes, subjectsRes, pyqsRes] = await Promise.all([
          API.get("/api/meta/PROGRAM"),
 API.get("/api/meta/DEPARTMENT"),
API.get("/api/meta/SUBJECT"),
API.get("/api/pyq/filter")

           // Fetch all PYQs initially
        ]);

        setPrograms(programsRes.data);
        setDepartments(departmentsRes.data);
        setSubjects(subjectsRes.data);
        setPyqs(pyqsRes.data);
        setAllPyqs(pyqsRes.data); // Store all PYQs for search
        
        // Calculate stats from actual data
        const total = pyqsRes.data.length;
        const downloads = pyqsRes.data.reduce((sum, pyq) => sum + (pyq.downloads || 0), 0);
        const uniqueDepartments = new Set(pyqsRes.data.map(p => p.department)).size;
        
        setStats({
          total,
          downloads,
          departments: uniqueDepartments
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch branches when MTECH and department selected
  useEffect(() => {
    if (filters.program === "MTECH" && filters.department) {
      API.get("/api/meta/BRANCH", {
        params: { program: "MTECH", department: filters.department }
      }).then(r => setBranches(r.data));
    } else {
      setBranches([]);
    }
  }, [filters.program, filters.department]);

  // Function to search PYQs
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is empty, show filtered results or all PYQs
      applyFiltersToPyqs(allPyqs, filters);
      return;
    }

    const searchLower = query.toLowerCase().trim();
    
    // Filter PYQs based on search query
    const filtered = allPyqs.filter(pyq => {
      const searchFields = [
        pyq.subject?.toLowerCase(),
        pyq.program?.toLowerCase(),
        pyq.department?.toLowerCase(),
        pyq.branch?.toLowerCase(),
        pyq.year?.toString(),
        pyq.semester?.toString()
      ].filter(Boolean); // Remove undefined/null values

      return searchFields.some(field => field.includes(searchLower));
    });

    setPyqs(filtered);
  };

  // Function to apply filters to PYQs
  const applyFiltersToPyqs = (pyqList, currentFilters) => {
    if (!currentFilters.program && !currentFilters.department && !currentFilters.subject && !currentFilters.semester) {
      setPyqs(pyqList);
      return;
    }

    const filtered = pyqList.filter(pyq => {
      if (currentFilters.program && pyq.program !== currentFilters.program) return false;
      if (currentFilters.department && pyq.department !== currentFilters.department) return false;
      if (currentFilters.branch && pyq.branch !== currentFilters.branch) return false;
      if (currentFilters.subject && pyq.subject !== currentFilters.subject) return false;
      if (currentFilters.semester && pyq.semester !== currentFilters.semester) return false;
      return true;
    });

    setPyqs(filtered);
  };

  const fetchPYQs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/pyq/filter", { params: filters });
const filteredData = res.data;

      
      // Apply search filter if there's a search query
      let finalData = filteredData;
      if (searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase().trim();
        finalData = filteredData.filter(pyq => {
          const searchFields = [
            pyq.subject?.toLowerCase(),
            pyq.program?.toLowerCase(),
            pyq.department?.toLowerCase(),
            pyq.branch?.toLowerCase(),
            pyq.year?.toString(),
            pyq.semester?.toString()
          ].filter(Boolean);

          return searchFields.some(field => field.includes(searchLower));
        });
      }

      setPyqs(finalData);
      setAllPyqs(filteredData); // Update all PYQs with filtered data
      
      // Update stats based on filtered results
      const total = finalData.length;
      const downloads = finalData.reduce((sum, pyq) => sum + (pyq.downloads || 0), 0);
      const uniqueDepartments = new Set(finalData.map(p => p.department)).size;
      
      setStats({
        total,
        downloads,
        departments: uniqueDepartments
      });
    } catch (error) {
      console.error("Error fetching PYQs:", error);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery(""); // Clear search query
    // Fetch all PYQs when clearing filters
    API.get("/api/pyq/filter").then(res => {
      setPyqs(res.data);
      setAllPyqs(res.data);
      const total = res.data.length;
      const downloads = res.data.reduce((sum, pyq) => sum + (pyq.downloads || 0), 0);
      const uniqueDepartments = new Set(res.data.map(p => p.department)).size;
      
      setStats({
        total,
        downloads,
        departments: uniqueDepartments
      });
    });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // If clearing a filter, fetch updated data immediately
    if (!value) {
      const { [key]: removed, ...remainingFilters } = newFilters;
      API.get("/api/pyq/filter", { params: remainingFilters }).then(res => {
        let finalData = res.data;
        
        // Apply search filter if there's a search query
        if (searchQuery.trim()) {
          const searchLower = searchQuery.toLowerCase().trim();
          finalData = res.data.filter(pyq => {
            const searchFields = [
              pyq.subject?.toLowerCase(),
              pyq.program?.toLowerCase(),
              pyq.department?.toLowerCase(),
              pyq.branch?.toLowerCase(),
              pyq.year?.toString(),
              pyq.semester?.toString()
            ].filter(Boolean);

            return searchFields.some(field => field.includes(searchLower));
          });
        }
        
        setPyqs(finalData);
        setAllPyqs(res.data);
      });
    }
  };
// Add this in your map function or after fetching data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section - CENTER ALIGNED */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"></div>
        
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Award className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Previous Year <span className="text-amber-300">Questions</span>
              </h1>
            </div>
            
            <p className="text-xl text-blue-100 max-w-3xl mb-10">
              Access comprehensive collection of previous year question papers. 
              Filter by program, department, and semester to find exactly what you need.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center w-full max-w-4xl">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="search"
                    placeholder="Search PYQs by subject, year, or code..."
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <Link to="/pyq/upload">
                <Button variant="premium" size="lg" className="shadow-2xl">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Upload PYQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-0 shadow-xl bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-gray-600">PYQ Papers</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-0 shadow-xl bg-gradient-to-r from-white to-emerald-50">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.downloads}</div>
                <div className="text-gray-600">Total Downloads</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-0 shadow-xl bg-gradient-to-r from-white to-purple-50">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.departments}</div>
                <div className="text-gray-600">Departments</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Filter PYQs
                </h3>
                <p className="text-sm text-gray-500 mt-1">Narrow down your search</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Program Filter */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                    Program
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={e => handleFilterChange('program', e.target.value)}
                      value={filters.program || ""}
                    >
                      <option value="">All Programs</option>
                      {programs.map(p => (
                        <option key={p._id} value={p.value}>{p.value}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Layers className="h-4 w-4 mr-2 text-blue-500" />
                    Department
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={e => handleFilterChange('department', e.target.value)}
                      value={filters.department || ""}
                    >
                      <option value="">All Departments</option>
                      {departments.map(d => (
                        <option key={d._id} value={d.value}>{d.value}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Branch Filter (MTECH only) */}
                {filters.program === "MTECH" && (
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                      Branch
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        onChange={e => handleFilterChange('branch', e.target.value)}
                        value={filters.branch || ""}
                      >
                        <option value="">All Branches</option>
                        {branches.map(b => (
                          <option key={b._id} value={b.value}>{b.value}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Subject Filter */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    Subject
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={e => handleFilterChange('subject', e.target.value)}
                      value={filters.subject || ""}
                    >
                      <option value="">All Subjects</option>
                      {subjects.map(s => (
                        <option key={s._id} value={s.value}>{s.value}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    Semester
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onChange={e => handleFilterChange('semester', e.target.value)}
                      value={filters.semester || ""}
                    >
                      <option value="">All Semesters</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={fetchPYQs}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Applying Filters...
                      </>
                    ) : (
                      <>
                        <Filter className="h-4 w-4 mr-2" />
                        Apply Filters
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - PYQ Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">PYQ Collection</h2>
                <p className="text-gray-600">
                  {pyqs.length > 0 
                    ? `Found ${pyqs.length} question paper${pyqs.length > 1 ? 's' : ''}`
                    : "No PYQs available yet"
                  }
                  {searchQuery && (
                    <span className="ml-2 text-blue-600">
                      for "{searchQuery}"
                    </span>
                  )}
                </p>
              </div>
              
              {pyqs.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="dark" className="px-4 py-2">
                    <Eye className="h-3 w-3 mr-1" />
                    {pyqs.length} Visible
                  </Badge>
                </div>
              )}
            </div>

            {pyqs.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl inline-block mb-6">
                    <FileText className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery ? "No PYQs Found" : "No PYQs Available"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? `No PYQs found matching "${searchQuery}". Try different search terms or filters.`
                      : "There are no PYQs available in the database yet. Be the first to upload question papers and help the community!"
                    }
                  </p>
                  {searchQuery ? (
                    <Button onClick={() => handleSearch('')}>
                      Clear Search
                    </Button>
                  ) : (
                    <Link to="/pyq/upload">
                      <Button variant="premium">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Upload First PYQ
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pyqs.map(p => {
                    console.log("PYQ data structure:", p);
                    console.log("File URL:", p.fileUrl);
                    return (
                    
                    <Card key={p._id} className="group hover:shadow-2xl transition-all duration-300">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge variant="success" className="mb-2">
                              {p.program || "Program"}
                            </Badge>
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                              {p.subject || "Subject Name"}
                            </h3>
                          </div>
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>

                        {/* Details */}
                    

                        <div className="space-y-3 mb-6">
                        {p.createdBy && (
  <p className="text-xs text-gray-500 mt-1">
    Uploaded by:
    <span className="font-semibold text-blue-600 ml-1">
      {p.createdBy.name}
    </span>
    {p.createdBy.registrationNo && (
      <span className="ml-1">
        ({p.createdBy.registrationNo})
      </span>
    )}
  </p>
)}


                          <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{p.department || "Department"}</span>
                            {p.branch && <span className="ml-2">• {p.branch}</span>}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Year: {p.year || "N/A"} | Sem: {p.semester || "N/A"}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              Semester {p.semester || "N/A"}
                            </Badge>
                            <Badge variant="warning">
                              {p.year || "Year"}
                            </Badge>
                          </div>
                        </div>

                        {/* Action Buttons */}
<div className="flex space-x-3">
  <a
    href={`${BASE_URL}/api/pyq/view/${p._id}`}
    target="_blank"
    rel="noreferrer"
    className="flex-1"
  >
    <span className="block">
      <Button variant="outline" className="w-full">
        <Eye className="h-4 w-4 mr-2" />
        Preview
      </Button>
    </span>
  </a>

  <Button
    className="flex-1 w-full"
    onClick={() =>
      window.open(`${BASE_URL}/api/pyq/download/${p._id}`, "_blank")
    }
  >
    <Download className="h-4 w-4 mr-2" />
    Download
  </Button>
</div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Verified Source
                          </div>
                          <div className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {(p.downloads || 0)} downloads
                          </div>
                        </div>
                      </div>
                    </Card>);
})}
                </div>

                {/* Pagination/Info */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Need more PYQs?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Can't find what you're looking for? Upload missing PYQs to help others.
                      </p>
                    </div>
                    <Link to="/pyq/upload">
                      <Button variant="premium">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Upload Missing PYQ
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PYQ;