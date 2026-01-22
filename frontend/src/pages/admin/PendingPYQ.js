import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = "http://localhost:5000";
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


function PendingPYQ() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [itemToReject, setItemToReject] = useState(null);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
  
      const res = await axios.get(
        `${API}/api/pyq/pending`,
        authHeader()
      );
      setData(res.data);
  
      const statsRes = await axios.get(
        `${API}/api/pyq/stats`,
        authHeader()
      );
      setStats(statsRes.data);
    } catch (err) {
      toast.error("Error fetching pending uploads");
      console.error("Error fetching pending uploads", err);
    } finally {
      setLoading(false);
    }
  };
  

  const approve = async (id) => {
    try {
      await axios.put(
        `${API}/api/pyq/approve/${id}`,
        {},
        authHeader()
      );
      setData(prev => prev.filter(d => d._id !== id));
      toast.success("PYQ approved successfully!");
    } catch (error) {
      toast.error("Failed to approve PYQ");
    }
  };
  

  const openRejectModal = (id) => {
    setItemToReject(id);
    setShowRejectModal(true);
  };

  const reject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
  
    try {
      await axios.put(
        `${API}/api/pyq/reject/${itemToReject}`,
        { reason: rejectReason },
        authHeader()
      );
      setData(prev => prev.filter(d => d._id !== itemToReject));
      toast.success("PYQ rejected successfully");
      setShowRejectModal(false);
      setRejectReason("");
      setItemToReject(null);
    } catch (error) {
      toast.error("Failed to reject PYQ");
    }
  };
  

  const viewDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const previewPYQ = (id) => {
    window.open(`${API}/api/pyq/view/${id}`, "_blank");
  };
  
  

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Pending PYQ Review</h1>
              </div>
              <p className="text-gray-600 mt-2">Review and approve student-submitted previous year questions</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-medium shadow-md">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {data.length} Pending
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">{stats.total || 0}</div>
              <div className="text-sm text-gray-600">Total Submissions</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.approved || 0}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-red-600">{stats.rejected || 0}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{data.length}</div>
              <div className="text-sm text-gray-600">Awaiting Review</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading pending submissions...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no pending PYQ submissions waiting for review. All submissions have been processed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Items List */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
                  <h2 className="text-lg font-semibold text-gray-800">Pending Submissions</h2>
                  <p className="text-sm text-gray-600 mt-1">Click any item to view details</p>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {data.map(p => (
                    <div
                      key={p._id}
                      onClick={() => viewDetails(p)}
                      className={`p-5 border-b border-gray-100 hover:bg-orange-50 cursor-pointer transition duration-150 ${
                        selectedItem?._id === p._id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{p.subject}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Submitted {getTimeAgo(p.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
    Uploaded by: <b>{p.createdBy?.name}</b> ({p.createdBy?.registrationNo})
  </span>
                            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {p.program}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              {p.department}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              Sem {p.semester}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                              Year {p.year}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Details Panel */}
            <div>
              {selectedItem ? (
                <div className="bg-white rounded-2xl shadow-lg sticky top-6">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Submission Details</h2>
                      <button
                        onClick={closeDetails}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <div className="text-lg font-semibold text-gray-900">{selectedItem.subject}</div>
                      </div>
                      <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Uploaded By
  </label>
  <div className="text-gray-900 font-medium">
    {selectedItem.createdBy?.name}
  </div>
  <div className="text-sm text-gray-600">
    Registration No: {selectedItem.createdBy?.registrationNo}
  </div>
  <div className="text-sm text-gray-500">
    Email: {selectedItem.createdBy?.email}
  </div>
</div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium inline-block">
                            {selectedItem.program}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium inline-block">
                            {selectedItem.department}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                          <div className="text-gray-900">Semester {selectedItem.semester}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <div className="text-gray-900">{selectedItem.year}</div>
                        </div>
                      </div>

                      {selectedItem.branch && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-block">
                            {selectedItem.branch}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                        <div className="text-gray-600">
                          {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Document</label>
                        <button
                          onClick={() => previewPYQ(selectedItem._id)}

                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          View PDF Document
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-b-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Actions</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => approve(selectedItem._id)}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Approve Submission
                      </button>
                      <button
                        onClick={() => openRejectModal(selectedItem._id)}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Reject Submission
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Please review the document carefully before taking action
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Submission</h3>
                  <p className="text-gray-600 max-w-md">
                    Click on any pending submission from the list to view detailed information and take review actions.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Submission</h3>
            <p className="text-gray-600 mb-6">
              Please provide a reason for rejecting this submission. The student will receive this feedback.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 mb-6"
              rows="4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setItemToReject(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={reject}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingPYQ;