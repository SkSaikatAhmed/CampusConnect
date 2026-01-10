// frontend/src/components/AdminLayout.js
import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import {
  Upload,
  Download,
  Settings,
  FileText,
  CheckSquare,
  FileCheck,
  Shield,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

// In AdminLayout.js - update handleLogout function
const handleLogout = () => {
    localStorage.removeItem('token'); // Changed from 'adminToken' to 'token'
    navigate('/login');
  };
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="ml-3 text-xl font-bold">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="p-4">
          <div className="mb-8">
            <p className={`text-xs text-gray-400 uppercase tracking-wider mb-3 ${sidebarCollapsed ? 'text-center' : ''}`}>
              {sidebarCollapsed ? '...' : 'Quick Actions'}
            </p>
            <div className="space-y-2">
              <Link
                to="/admin/dashboard"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Dashboard"
              >
                <Home className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </Link>

              <Link
                to="/admin/upload-pyq"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Upload PYQ"
              >
                <Upload className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Upload PYQ</span>}
              </Link>

              <Link
                to="/admin/upload-notes"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Upload Notes"
              >
                <Download className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Upload Notes</span>}
              </Link>

              <Link
                to="/admin/manage"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Manage Content"
              >
                <Settings className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Manage Content</span>}
              </Link>

              <Link
                to="/admin/manage-notes"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Manage Notes"
              >
                <FileText className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Manage Notes</span>}
              </Link>

              <Link
                to="/admin/review-requests"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Review Uploads"
              >
                <CheckSquare className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Review Uploads</span>}
              </Link>

              <Link
                to="/admin/review-notes"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Review Notes"
              >
                <FileCheck className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Review Notes</span>}
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <p className={`text-xs text-gray-400 uppercase tracking-wider mb-3 ${sidebarCollapsed ? 'text-center' : ''}`}>
              {sidebarCollapsed ? '...' : 'System'}
            </p>
            <div className="space-y-2">
              <button
                onClick={handleRefresh}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Refresh Data"
                disabled={refreshing}
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                {!sidebarCollapsed && <span className="ml-3">Refresh Data</span>}
              </button>

              <Link
                to="/admin/settings"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Settings</span>}
              </Link>

              <Link
                to="/"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="View Site"
              >
                <Home className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">View Site</span>}
              </Link>

              <button
                onClick={handleLogout}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-red-700 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3">Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet /> {/* This will render the child admin pages */}
      </div>
    </div>
  );
}

export default AdminLayout;