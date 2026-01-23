import { useEffect, useState } from "react";
import API from "../../api";
const BASE_URL = process.env.REACT_APP_API_URL;

function ManageContent() {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/pyq/get");
      setPyqs(res.data);
    } catch (error) {
      console.error("Error fetching PYQs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const programs = ["All", ...new Set(pyqs.map(p => p.program))].filter(Boolean);
  const years = ["All", ...new Set(pyqs.map(p => p.year))].sort((a, b) => b - a).filter(Boolean);

  // Filter PYQs based on search and filters
  const filteredPyqs = pyqs.filter(pyq => {
    const matchesSearch = 
      pyq.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.year?.toString().includes(searchTerm);

    const matchesProgram = selectedProgram === "All" || pyq.program === selectedProgram;
    const matchesYear = selectedYear === "All" || pyq.year?.toString() === selectedYear;

    return matchesSearch && matchesProgram && matchesYear;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPyqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPyqs = filteredPyqs.slice(startIndex, startIndex + itemsPerPage);


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this PYQ?")) {
      try {
        await API.delete(`/api/pyq/delete/${id}`);
        fetchPYQs();
      } catch (error) {
        alert("Failed to delete PYQ");
      }
    }
  };

  const previewPYQ = (id) => {
    window.open(`${BASE_URL}/api/pyq/view/${id}`, "_blank");
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Previous Year Questions</h1>
              <p className="text-gray-600 mt-2">View, search, and manage all uploaded PYQs</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {pyqs.length} PYQs
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{pyqs.length}</div>
              <div className="text-sm text-gray-600">Total PYQs</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {new Set(pyqs.map(p => p.subject)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Subjects</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(pyqs.map(p => p.department)).size}
              </div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(pyqs.map(p => p.year)).size}
              </div>
              <div className="text-sm text-gray-600">Years Covered</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by subject, department, program, or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            {/* Program Filter */}
            <div>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition duration-200"
              >
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition duration-200"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedProgram !== "All" || selectedYear !== "All" || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedProgram !== "All" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                  Program: {selectedProgram}
                  <button onClick={() => setSelectedProgram("All")} className="ml-2 text-blue-500 hover:text-blue-700">
                    ×
                  </button>
                </span>
              )}
              {selectedYear !== "All" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                  Year: {selectedYear}
                  <button onClick={() => setSelectedYear("All")} className="ml-2 text-green-500 hover:text-green-700">
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-2 text-purple-500 hover:text-purple-700">
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedProgram("All");
                  setSelectedYear("All");
                }}
                className="text-sm text-gray-600 hover:text-gray-800 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Content Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">PYQ Documents</h2>
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPyqs.length)} of {filteredPyqs.length} results
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading PYQs...</p>
            </div>
          ) : filteredPyqs.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="mt-4 text-gray-600">No PYQs found matching your criteria</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Subject</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Program/Dept</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Academic Info</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedPyqs.map(pyq => (
                      <tr key={pyq._id} className="hover:bg-gray-50 transition duration-150">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{pyq.subject}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Year: {pyq.year}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {pyq.program || "N/A"}
                            </div>
                            <div className="text-sm text-gray-700">{pyq.department}</div>
                            {pyq.branch && (
                              <div className="text-xs text-gray-500">Branch: {pyq.branch}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">Semester:</span> {pyq.semester || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pyq.fileUrl && (
                                <span className="inline-flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                  </svg>
                                  PDF
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => previewPYQ(pyq._id)}

                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(pyq._id)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition duration-200 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageContent;