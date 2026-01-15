// frontend/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Profile from './components/Profile';
import AdminLayout from './components/AdminLayout';

import Home from "./pages/Home";
import FacultyReview from "./pages/FacultyReview";
import Notes from "./pages/Notes";
import UploadNotes from "./pages/UploadNotes";
import PYQ from "./pages/PYQ";

import AIQuestionGenerator from "./pages/AIQuestionGenerator";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageContent from "./pages/admin/ManageContent";
import PendingPYQ from "./pages/admin/PendingPYQ";
import AdminUpload from "./pages/admin/AdminUpload";
import PendingNotes from "./pages/admin/PendingNotes";
import ManageNotes from "./pages/admin/ManageNotes";

import StudentUpload from "./pages/StudentUpload";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<StudentRegister />} />

        {/* -------- STUDENT ROUTES (LOGIN REQUIRED) -------- */}
        <Route
          path="/pyq"
          element={
            <PrivateRoute>
              <PYQ />
            </PrivateRoute>
          }
        />

        <Route
          path="/pyq/upload"
          element={
            <PrivateRoute>
              <StudentUpload />
            </PrivateRoute>
          }
        />

        <Route
          path="/notes/upload"
          element={
            <PrivateRoute>
              <UploadNotes />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <FacultyReview />
            </PrivateRoute>
          }
        />

        <Route
          path="/ai"
          element={
            <PrivateRoute>
              <AIQuestionGenerator />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />


        {/* -------- ADMIN ROUTES (ADMIN / SUPER ADMIN ONLY) -------- */}
        {/* Wrap all admin routes inside AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* These routes will be rendered inside AdminLayout's Outlet */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="upload-pyq" element={<AdminUpload type="pyq" />} />
          <Route path="upload-notes" element={<AdminUpload type="notes" />} />
          <Route path="review-requests" element={<PendingPYQ />} />
          <Route path="review-notes" element={<PendingNotes />} />
          <Route path="manage" element={<ManageContent />} />
          <Route path="manage-notes" element={<ManageNotes />} />
        </Route>

        {/* Remove these old separate admin routes since they're now nested */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;