import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import FacultyReview from "./pages/FacultyReview";
import Notes from "./pages/Notes";
import UploadNotes from "./pages/UploadNotes"; // STUDENT
import PYQ from "./pages/PYQ";
import AIQuestionGenerator from "./pages/AIQuestionGenerator";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageContent from "./pages/admin/ManageContent";
import PendingPYQ from "./pages/admin/PendingPYQ";
import AdminUpload from "./pages/admin/AdminUpload";

import StudentUpload from "./pages/StudentUpload";

import PendingNotes from "./pages/admin/PendingNotes";
import ManageNotes from "./pages/admin/ManageNotes";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/reviews" element={<FacultyReview />} />
        <Route path="/ai" element={<AIQuestionGenerator />} />

        {/* -------- STUDENT ROUTES -------- */}
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/pyq/upload" element={<StudentUpload />} />
        <Route path="/notes/upload" element={<UploadNotes />} />

        {/* -------- ADMIN ROUTES -------- */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ADMIN UPLOAD (REFACTORED) */}
        <Route path="/admin/upload-pyq" element={<AdminUpload type="pyq" />} />
        <Route path="/admin/upload-notes" element={<AdminUpload type="notes" />} />

        {/* ADMIN REVIEW */}
        <Route path="/admin/review-requests" element={<PendingPYQ />} />
        <Route path="/admin/review-notes" element={<PendingNotes />} />

        {/* ADMIN MANAGE */}
        <Route path="/admin/manage" element={<ManageContent />} />
        <Route path="/admin/manage-notes" element={<ManageNotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
