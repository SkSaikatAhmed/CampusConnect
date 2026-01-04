import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/upload-pyq" className="p-6 bg-blue-500 text-white rounded shadow">
          Upload PYQ
        </Link>

        <Link to="/admin/manage" className="p-6 bg-green-500 text-white rounded shadow">
          Manage Content
        </Link>

        <Link to="/admin/review-requests" className="p-6 bg-purple-500 text-white rounded shadow">
          Review Student Uploads
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
