const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadPYQ, getAllPYQ } = require("../controllers/pyqController");
const { studentUploadPYQ } = require("../controllers/pyqController");

router.post("/upload", upload.single("file"), uploadPYQ);
router.get("/get", getAllPYQ);
router.get("/pending", async (req, res) => {
    const PYQ = require("../models/PYQModel");
    const data = await PYQ.find({ status: "PENDING" }).sort({ createdAt: -1 });
    res.json(data);
  });

  // STUDENT UPLOAD (PENDING)
router.post(
    "/student-upload",
    upload.single("file"),
    studentUploadPYQ
  );
  
router.get("/filter", async (req, res) => {
    try {
      const PYQ = require("../models/PYQModel");
  
      const query = { status: "APPROVED" };
  
      const {
        program,
        department,
        branch,
        subject,
        semester,
        year,
      } = req.query;
  
      if (program) query.program = program;
      if (department) query.department = department;
      if (branch) query.branch = branch;
      if (subject) query.subject = subject;
      if (semester) query.semester = Number(semester);
      if (year) query.year = Number(year);
  
      const pyqs = await PYQ.find(query).sort({ year: -1 });
      res.json(pyqs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Filter failed" });
    }
  });
  // ADMIN – Approve
router.put("/approve/:id", async (req, res) => {
    const PYQ = require("../models/PYQModel");
    await PYQ.findByIdAndUpdate(req.params.id, {
      status: "APPROVED",
      rejectionReason: null,
    });
    res.json({ message: "Approved" });
  });
  
  // ADMIN – Reject
  router.put("/reject/:id", async (req, res) => {
    const PYQ = require("../models/PYQModel");
    await PYQ.findByIdAndUpdate(req.params.id, {
      status: "REJECTED",
      rejectionReason: req.body.reason || "Not suitable",
    });
    res.json({ message: "Rejected" });
  });
  
  
module.exports = router;
