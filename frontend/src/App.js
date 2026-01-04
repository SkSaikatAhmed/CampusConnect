import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import FacultyReview from "./pages/FacultyReview";
import Notes from "./pages/Notes";
import PYQ from "./pages/PYQ";
import AIQuestionGenerator from "./pages/AIQuestionGenerator";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UploadPYQ from "./pages/admin/UploadPYQ";
import ManageContent from "./pages/admin/ManageContent";
import PendingPYQ from "./pages/admin/PendingPYQ";

import StudentUpload from "./pages/StudentUpload";

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

        {/* -------- STUDENT ROUTES (OPEN) -------- */}
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/pyq/upload" element={<StudentUpload />} />

        {/* -------- ADMIN ROUTES (OPEN) -------- */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/upload-pyq" element={<UploadPYQ />} />
        <Route path="/admin/manage" element={<ManageContent />} />
        <Route path="/admin/review-requests" element={<PendingPYQ />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
