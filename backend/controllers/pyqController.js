const PYQ = require("../models/PYQModel");
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
exports.uploadPYQByAdmin = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "PDF required" });

    const result = await uploadToCloudinary(
      req.file.buffer,
      "campusconnect/pyq"
    );

    const pyq = await PYQ.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      year: req.body.year ? Number(req.body.year) : null,
      description: req.body.description,
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
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
    if (!req.file) return res.status(400).json({ message: "PDF required" });

    const result = await uploadToCloudinary(
      req.file.buffer,
      "campusconnect/pyq"
    );

    const pyq = await PYQ.create({
      program: req.body.program,
      department: req.body.department,
      subject: req.body.subject,
      year: req.body.year ? Number(req.body.year) : null,
      description: req.body.description,
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      uploadedBy: "STUDENT",
      status: "PENDING",
      createdBy: req.user._id,
    });

    res.status(201).json(pyq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= FILTER =================
exports.filterPYQ = async (req, res) => {
  const pyqs = await PYQ.find({ status: "APPROVED", ...req.query })
    .populate("createdBy", "name registrationNo")
    .sort({ createdAt: -1 });
  res.json(pyqs);
};

// ================= PENDING =================
exports.getPendingPYQ = async (req, res) => {
  const pyqs = await PYQ.find({ status: "PENDING" })
    .populate("createdBy", "name email registrationNo")
    .sort({ createdAt: -1 });
  res.json(pyqs);
};

// ================= APPROVE =================
exports.approvePYQ = async (req, res) => {
  await PYQ.findByIdAndUpdate(req.params.id, { status: "APPROVED" });
  res.json({ message: "PYQ approved" });
};

// ================= DELETE =================
exports.deletePYQ = async (req, res) => {
  const pyq = await PYQ.findById(req.params.id);
  if (!pyq) return res.status(404).json({ error: "Not found" });

  if (pyq.filePublicId) {
    await cloudinary.uploader.destroy(pyq.filePublicId, {
      resource_type: "raw",
    });
  }

  await PYQ.findByIdAndDelete(req.params.id);
  res.json({ message: "PYQ deleted" });
};
