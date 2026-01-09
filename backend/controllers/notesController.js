const NOTES = require("../models/NotesModel");

/* ADMIN UPLOAD */
exports.uploadNotes = async (req, res) => {
  try {
    const { program, department, branch, subject, semester, year } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "PDF file required" });

    if (!program || !department || !subject || !semester || !year)
      return res.status(400).json({ message: "All fields required" });

    if (program === "MTECH" && !branch)
      return res.status(400).json({ message: "Branch required for MTECH" });

    const notes = await NOTES.create({
      program,
      department,
      branch: program === "MTECH" ? branch : null,
      subject,
      semester,
      year,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      uploadedBy: "ADMIN",
      status: "APPROVED",
    });

    res.json({ message: "Notes uploaded", notes });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};

/* GET APPROVED NOTES */
exports.getAllNotes = async (req, res) => {
  const data = await NOTES.find({ status: "APPROVED" }).sort({ createdAt: -1 });
  res.json(data);
};

/* STUDENT UPLOAD */
exports.studentUploadNotes = async (req, res) => {
  try {
    const { program, department, branch, subject, semester, year } = req.body;

    if (!req.file) return res.status(400).json({ message: "PDF required" });

    const notes = await NOTES.create({
      program,
      department,
      branch: program === "MTECH" ? branch : null,
      subject,
      semester,
      year,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      uploadedBy: "STUDENT",
      status: "PENDING",
    });

    res.json({ message: "Uploaded. Awaiting approval." });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};
