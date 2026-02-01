const NOTES = require("../models/NotesModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ================= ADMIN UPLOAD =================
exports.uploadNotesByAdmin = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "PDF required" });

    const result = await uploadToCloudinary(
      req.file.buffer,
      "campusconnect/notes"
    );

    const note = await NOTES.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      semester: req.body.semester ? Number(req.body.semester) : null,
      description: req.body.description,
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
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
    if (!req.file) return res.status(400).json({ message: "PDF required" });

    const result = await uploadToCloudinary(
      req.file.buffer,
      "campusconnect/notes"
    );

    const note = await NOTES.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      semester: req.body.semester ? Number(req.body.semester) : null,
      description: req.body.description,
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      uploadedBy: "STUDENT",
      status: "PENDING",
      createdBy: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= FILTER =================
exports.filterNotes = async (req, res) => {
  const notes = await NOTES.find({ status: "APPROVED", ...req.query })
    .populate("createdBy", "name registrationNo")
    .sort({ createdAt: -1 });
  res.json(notes);
};

// ================= PENDING =================
exports.getPendingNotes = async (req, res) => {
  const notes = await NOTES.find({ status: "PENDING" })
    .populate("createdBy", "name email registrationNo")
    .sort({ createdAt: -1 });
  res.json(notes);
};

// ================= APPROVE =================
exports.approveNote = async (req, res) => {
  await NOTES.findByIdAndUpdate(req.params.id, { status: "APPROVED" });
  res.json({ message: "Note approved" });
};

// ================= DELETE =================
exports.deleteNote = async (req, res) => {
  const note = await NOTES.findById(req.params.id);
  if (!note) return res.status(404).json({ error: "Not found" });

  if (note.filePublicId) {
    await cloudinary.uploader.destroy(note.filePublicId, {
      resource_type: "raw",
    });
  }

  await NOTES.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
};
