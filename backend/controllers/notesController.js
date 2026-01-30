const NOTES = require("../models/NotesModel");
const cloudinary = require("../utils/cloudinary");

// ================= ADMIN UPLOAD =================
exports.uploadNotesByAdmin = async (req, res) => {
  try {
    const note = await NOTES.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      semester: req.body.semester,
      description: req.body.description,
      fileUrl: req.file.path,
      uploadedBy: "ADMIN",
      status: "APPROVED",
      createdBy: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= STUDENT UPLOAD =================
exports.uploadNotesByStudent = async (req, res) => {
  try {
    const note = await NOTES.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      semester: req.body.semester,
      description: req.body.description,
      fileUrl: req.file.path,
      uploadedBy: "STUDENT",
      status: "PENDING",
      createdBy: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= USER FETCH (FIX APPLIED HERE) =================
exports.filterNotes = async (req, res) => {
  try {
    const query = { status: "APPROVED", ...req.query };

    const data = await NOTES.find(query)
      .populate("createdBy", "name registrationNo")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ADMIN FETCH =================
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await NOTES.find()
      .populate("createdBy", "name email registrationNo")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= PENDING =================
exports.getPendingNotes = async (req, res) => {
  try {
    const notes = await NOTES.find({ status: "PENDING" })
      .populate("createdBy", "name email registrationNo")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= APPROVE =================
exports.approveNote = async (req, res) => {
  try {
    await NOTES.findByIdAndUpdate(req.params.id, { status: "APPROVED" });
    res.json({ message: "Note approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteNote = async (req, res) => {
  try {
    const note = await NOTES.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Not found" });

    await cloudinary.uploader.destroy(note.fileUrl);
    await NOTES.findByIdAndDelete(req.params.id);

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
