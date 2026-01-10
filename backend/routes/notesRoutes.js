const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadNotes,
  getAllNotes,
  studentUploadNotes,
} = require("../controllers/notesController");

router.post("/upload", upload.single("file"), uploadNotes);
router.post("/student-upload", upload.single("file"), studentUploadNotes);
router.get("/get", getAllNotes);
// ADMIN – Pending Notes
router.get("/pending", async (req, res) => {
    const NOTES = require("../models/NotesModel");
    const data = await NOTES.find({ status: "PENDING" }).sort({ createdAt: -1 });
    res.json(data);
  });
  
  // ADMIN – Approve Notes
  router.put("/approve/:id", async (req, res) => {
    const NOTES = require("../models/NotesModel");
    await NOTES.findByIdAndUpdate(req.params.id, {
      status: "APPROVED",
      rejectionReason: null,
    });
    res.json({ message: "Approved" });
  });
  
  // ADMIN – Reject Notes
  router.put("/reject/:id", async (req, res) => {
    const NOTES = require("../models/NotesModel");
    await NOTES.findByIdAndUpdate(req.params.id, {
      status: "REJECTED",
      rejectionReason: req.body.reason || "Not suitable",
    });
    res.json({ message: "Rejected" });
  });
  
router.get("/filter", async (req, res) => {
  const NOTES = require("../models/NotesModel");
  const query = { status: "APPROVED" };

  Object.keys(req.query).forEach(k => {
    if (req.query[k]) query[k] = isNaN(req.query[k]) ? req.query[k] : Number(req.query[k]);
  });

  const data = await NOTES.find(query).sort({ year: -1 });
  res.json(data);
});

module.exports = router;
