import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Trash2,
  Eye,
  UserCheck,
  AlertCircle,
  Search,
  UserCog,
  FileCheck,
  Ban,
  Mail,
} from "lucide-react";

import API from "../../api";
// This will be: https://campusconnect-bmrw.onrender.com
import AddAdminModal from "./AddAdminModal";
import AdminAddStudent from "./AdminAddStudent";


const token = localStorage.getItem("token");
const myRole = token ? JSON.parse(atob(token.split(".")[1])).role : null;

function AdminDashboard() {
  const [showAddStudent, setShowAddStudent] = useState(false);
const [showAddAdmin, setShowAddAdmin] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    pendingPYQs: 0,
    pendingNotes: 0,
    approvedPYQs: 0,
    approvedNotes: 0,
    bannedUsers: 0,
    activeToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real data
  useEffect(() => {
    fetchAllData();
  }, []);
  

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        fetchUsersData(),
        fetchPYQsData(),
        fetchNotesData()
      ]);
      calculateStats();
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchUsersData = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const res = await API.get("/api/admin/users");
      const data = res.data;

  
      setUsers(data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  

  const fetchPYQsData = async () => {
    try {
      const res = await API.get("/api/pyq/filter");
return res.data;

    } catch (error) {
      console.error("Error fetching PYQs:", error);
      return [];
    }
  };

  const fetchNotesData = async () => {
    try {
      const res = await API.get("/api/notes/filter");
return res.data;

    } catch (error) {
      console.error("Error fetching Notes:", error);
      return [];
    }
  };

  const fetchPendingData = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const [pyqsRes, notesRes] = await Promise.all([
        API.get("/api/pyq/pending"),
        API.get("/api/notes/pending"),
      ]);
      
  
      const pendingPYQs = pyqsRes.data;
const pendingNotes = notesRes.data;

  
      return { pendingPYQs, pendingNotes };
    } catch (error) {
      console.error("Error fetching pending data:", error);
      return { pendingPYQs: [], pendingNotes: [] };
    }
  };
  

  const calculateStats = async () => {
    try {
      const allUsers = users.length > 0 ? users : await fetchUsersData();
      const allPYQs = await fetchPYQsData();
      const allNotes = await fetchNotesData();
      const { pendingPYQs, pendingNotes } = await fetchPendingData();

      const totalStudents = allUsers.filter(u => u.role === "STUDENT").length;
      const totalAdmins = allUsers.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;
      const bannedUsers = allUsers.filter(u => u.isBanned).length;
      
      const approvedPYQs = allPYQs.filter(p => p.status === "APPROVED").length;
      const approvedNotes = allNotes.filter(n => n.status === "APPROVED").length;

      setStats({
        totalUsers: allUsers.length,
        totalStudents,
        totalAdmins,
        pendingPYQs: pendingPYQs.length,
        pendingNotes: pendingNotes.length,
        approvedPYQs,
        approvedNotes,
        bannedUsers,
        activeToday: allUsers.length // You can implement session tracking later
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban/unban this user?')) return;
    
    try {
      const response = await API.put(`/api/admin/users/${userId}/ban`, { action: "toggle" });
      
      if (response.status === 200) {
        // Update local state
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isBanned: !user.isBanned } : user
        ));
        
        // Recalculate stats
        calculateStats();
        
        alert(`User ${users.find(u => u._id === userId)?.isBanned ? 'unbanned' : 'banned'} successfully`);
      }
    } catch (error) {
      console.error("Error banning user:", error);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u._id === userId);
    if (!userToDelete) return;
    
    if (userToDelete.role === "SUPER_ADMIN") {
      alert("Cannot delete SUPER_ADMIN user");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`)) return;
    
    try {
      const response = await API.delete(`/api/users/${userId}`);
      
      if (response.status === 200) {
        setUsers(users.filter(user => user._id !== userId));
        calculateStats();
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert('Failed to delete user');
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "banned" && user.isBanned) ||
      (filterStatus === "active" && !user.isBanned);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">


      {/* Main Content */}
      {/* <div className="flex-1 overflow-auto"> */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage users, content, and system settings</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">System Online</span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="text-green-600">{stats.totalStudents} Students</span>
                <span className="text-purple-600">{stats.totalAdmins} Admins</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pendingPYQs + stats.pendingNotes}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="text-blue-600">{stats.pendingPYQs} PYQs</span>
                <span className="text-indigo-600">{stats.pendingNotes} Notes</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved Content</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.approvedPYQs + stats.approvedNotes}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileCheck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="text-purple-600">{stats.approvedPYQs} PYQs</span>
                <span className="text-teal-600">{stats.approvedNotes} Notes</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Banned Users</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.bannedUsers}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <Ban className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${stats.totalUsers > 0 ? (stats.bannedUsers / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <UserCog className="w-5 h-5 mr-2 text-blue-600" />
                    User Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Manage all registered users</p>
                </div>
                {["ADMIN", "SUPER_ADMIN"].includes(myRole) && (
  <button
    onClick={() => setShowAddStudent(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    Add Student
  </button>
)}

{myRole === "SUPER_ADMIN" && (
  <button
    onClick={() => setShowAddAdmin(true)}
    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
  >
    Add Admin
  </button>
)}

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      <option value="STUDENT">Student</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-500">No users found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </p>
                            {user.registrationNo && (
                              <p className="text-xs text-gray-400">Reg No: {user.registrationNo}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {user.program && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {user.program}
                              </span>
                            )}
                            {user.department && (
                              <p className="text-sm text-gray-600">{user.department}</p>
                            )}
                            {user.branch && (
                              <p className="text-xs text-gray-500">Branch: {user.branch}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'SUPER_ADMIN' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.isBanned 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewUserDetails(user)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(
  user.role === "STUDENT" ||
  (myRole === "SUPER_ADMIN" && user.role === "ADMIN")
) && (

                            <button
                              onClick={() => handleBanUser(user._id)}
                              className={`p-2 rounded-lg transition-all ${
                                user.isBanned
                                  ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                              title={user.isBanned ? 'Unban User' : 'Ban User'}
                            >
                              {user.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </button>
)}
                            {(
  user.role === "STUDENT" ||
  (myRole === "SUPER_ADMIN" && user.role === "ADMIN")
) && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {!loading && filteredUsers.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing {filteredUsers.length} of {users.length} users
                  </p>
                  <div className="text-sm text-gray-500">
                    {refreshing ? 'Refreshing...' : 'Ready'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      {/* </div> */}

      {/* User Details Modal */}
      {userDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">User Details</h3>
                <button
                  onClick={() => setUserDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Full Name</p>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email Address</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    {selectedUser.registrationNo && (
                      <div>
                        <p className="text-xs text-gray-400">Registration Number</p>
                        <p className="font-medium">{selectedUser.registrationNo}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Role</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.role === 'SUPER_ADMIN' 
                          ? 'bg-purple-100 text-purple-800'
                          : selectedUser.role === 'ADMIN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedUser.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.isBanned 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedUser.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Member Since</p>
                      <p className="font-medium">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {(selectedUser.program || selectedUser.department) && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Academic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedUser.program && (
                        <div>
                          <p className="text-xs text-gray-400">Program</p>
                          <p className="font-medium">{selectedUser.program}</p>
                        </div>
                      )}
                      {selectedUser.department && (
                        <div>
                          <p className="text-xs text-gray-400">Department</p>
                          <p className="font-medium">{selectedUser.department}</p>
                        </div>
                      )}
                      {selectedUser.branch && (
                        <div>
                          <p className="text-xs text-gray-400">Branch</p>
                          <p className="font-medium">{selectedUser.branch}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setUserDetailsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Close
                </button>
                {selectedUser.role !== 'SUPER_ADMIN' && (
                  <button
                    onClick={() => {
                      handleBanUser(selectedUser._id);
                      setUserDetailsModal(false);
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      selectedUser.isBanned
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

{showAddStudent && (
  <AdminAddStudent
    onClose={() => setShowAddStudent(false)}
    onSuccess={fetchAllData}
  />
)}

{showAddAdmin && (
  <AddAdminModal
    onClose={() => setShowAddAdmin(false)}
    onSuccess={fetchAllData}
  />
)}

    </div>
  );
}

export default AdminDashboard;