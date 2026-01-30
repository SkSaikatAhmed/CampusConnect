const PYQ = require("../models/PYQModel");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ================= ADMIN UPLOAD =================
exports.uploadPYQByAdmin = async (req, res) => {
  try {
    const pyq = await PYQ.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      year: req.body.year,
      description: req.body.description,
      fileUrl: req.file.path,
      uploadedBy: "ADMIN",
      status: "APPROVED",
      createdBy: req.user._id,
    });

    res.status(201).json(pyq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= STUDENT UPLOAD =================
exports.uploadPYQByStudent = async (req, res) => {
  try {
    const pyq = await PYQ.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      year: req.body.year,
      description: req.body.description,
      fileUrl: req.file.path,
      uploadedBy: "STUDENT",
      status: "PENDING",
      createdBy: req.user._id,
    });

    res.status(201).json(pyq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= USER FETCH (FIX APPLIED HERE) =================
exports.filterPYQ = async (req, res) => {
  try {
    const query = { status: "APPROVED", ...req.query };

    const pyqs = await PYQ.find(query)
      .populate("createdBy", "name registrationNo")
      .sort({ createdAt: -1 });

    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ADMIN FETCH =================
exports.getAllPYQ = async (req, res) => {
  try {
    const pyqs = await PYQ.find()
      .populate("createdBy", "name email registrationNo")
      .sort({ createdAt: -1 });

    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= PENDING =================
exports.getPendingPYQ = async (req, res) => {
  try {
    const pyqs = await PYQ.find({ status: "PENDING" })
      .populate("createdBy", "name email registrationNo")
      .sort({ createdAt: -1 });

    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= APPROVE =================
exports.approvePYQ = async (req, res) => {
  try {
    await PYQ.findByIdAndUpdate(req.params.id, { status: "APPROVED" });
    res.json({ message: "PYQ approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deletePYQ = async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) return res.status(404).json({ error: "Not found" });

    await cloudinary.uploader.destroy(pyq.fileUrl);
    await PYQ.findByIdAndDelete(req.params.id);

    res.json({ message: "PYQ deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
