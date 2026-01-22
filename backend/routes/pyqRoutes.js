const axios = require("axios");

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const PYQ = require("../models/PYQModel");
const { protect } = require("../middleware/authMiddleware");
const { uploadPYQ, getAllPYQ, studentUploadPYQ } = require("../controllers/pyqController");

// Uploads
router.post("/upload", upload.single("file"), uploadPYQ);
router.post("/student-upload", protect, upload.single("file"), studentUploadPYQ);
router.get("/get", getAllPYQ);

// ✅ STUDENT COUNT (APPROVED ONLY)
router.get("/my/count", protect, async (req, res) => {
  const count = await PYQ.countDocuments({
    createdBy: req.user._id,
    status: "APPROVED",
  });
  res.json({ count });
});

// ADMIN – Pending
router.get("/pending", protect, async (req, res) => {
  const data = await PYQ.find({ status: "PENDING" })
    .populate("createdBy", "name registrationNo email");
  res.json(data);
});

// ADMIN – Approve
router.put("/approve/:id", protect, async (req, res) => {
  await PYQ.findByIdAndUpdate(req.params.id, {
    status: "APPROVED",
    rejectionReason: null,
  });
  res.json({ message: "Approved" });
});

// ADMIN – Reject
router.put("/reject/:id", protect, async (req, res) => {
  await PYQ.findByIdAndUpdate(req.params.id, {
    status: "REJECTED",
    rejectionReason: req.body.reason || "Not suitable",
  });
  res.json({ message: "Rejected" });
});

// Filter
router.get("/filter", async (req, res) => {
  const query = { status: "APPROVED" };

  const { program, department, branch, subject, semester, year } = req.query;
  if (program) query.program = program;
  if (department) query.department = department;
  if (branch) query.branch = branch;
  if (subject) query.subject = subject;
  if (semester) query.semester = Number(semester);
  if (year) query.year = Number(year);

  const pyqs = await PYQ.find(query).sort({ year: -1 });
  res.json(pyqs);
});

// 🔴 Replace the existing /view/:id route with this:
router.get("/view/:id", async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) return res.status(404).send("PYQ not found");

    // Redirect directly to Cloudinary URL for inline viewing
    res.redirect(pyq.fileUrl);
  } catch (err) {
    console.error("PYQ VIEW ERROR:", err.message);
    res.status(500).send("Unable to preview PYQ");
  }
});

// 🔴 Replace the existing /download/:id route with this:
router.get("/download/:id", async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) return res.status(404).send("PYQ not found");

    // Get the filename from the URL or use subject name
    const filename = pyq.subject 
      ? `${pyq.subject.replace(/\s+/g, '_')}_PYQ.pdf`
      : "pyq.pdf";
    
    // Set headers for forced download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Redirect to Cloudinary URL for download
    res.redirect(pyq.fileUrl);
  } catch (err) {
    console.error("PYQ DOWNLOAD ERROR:", err.message);
    res.status(500).send("Download failed");
  }
});

module.exports = router;
