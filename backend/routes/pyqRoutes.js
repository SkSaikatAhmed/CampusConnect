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

module.exports = router;
