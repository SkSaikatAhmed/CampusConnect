const PYQ = require("../models/PYQModel");

exports.uploadPYQ = async (req, res) => {
  try {
    const { department, course, subject, year } = req.body;

    if (!department || !course || !subject || !year) {
      return res
        .status(400)
        .json({ message: "All fields (dept, course, subject, year) required!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const fileUrl = "/uploads/pyq/" + req.file.filename;

    const newPYQ = new PYQ({
      department,
      course,
      subject,
      year,
      fileUrl,
    });

    await newPYQ.save();

    res.json({ message: "PYQ uploaded successfully!" });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

exports.getAllPYQ = async (req, res) => {
  try {
    const pyqs = await PYQ.find().sort({ uploadedAt: -1 });
    res.json(pyqs);
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ message: "Error fetching PYQs" });
  }
};
