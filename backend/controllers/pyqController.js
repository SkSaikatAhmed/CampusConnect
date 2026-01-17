const PYQ = require("../models/PYQModel");

exports.uploadPYQ = async (req, res) => {
  try {
    const {
      program,
      department,
      branch,
      subject,
      semester,
      year,
    } = req.body;

    // File check
    if (!req.file) {
      return res.status(400).json({ message: "PDF file required" });
    }

    // Basic validation
    if (!program || !department || !subject || !semester || !year) {
      return res.status(400).json({
        message: "Program, Department, Subject, Semester and Year are required",
      });
    }

    // MTECH branch validation
    if (program === "MTECH" && !branch) {
      return res
        .status(400)
        .json({ message: "Branch is required for MTECH" });
    }

    const fileUrl = `/uploads/pyq/${req.file.filename}`;

    const newPYQ = new PYQ({
      program,
      department,
      branch: program === "MTECH" ? branch : null,
      subject,
      semester,
      year,
      fileUrl,
      uploadedBy: "ADMIN",
      status: "APPROVED",
    });

    await newPYQ.save();

    res.json({
      message: "PYQ uploaded successfully",
      pyq: newPYQ,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

exports.getAllPYQ = async (req, res) => {
  try {
    const pyqs = await PYQ.find({ status: "APPROVED" }).sort({
      createdAt: -1,
    });
    res.json(pyqs);
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ message: "Error fetching PYQs" });
  }
};


exports.studentUploadPYQ = async (req, res) => {
  try {
    const {
      program,
      department,
      branch,
      subject,
      semester,
      year,
    } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "PDF required" });

    if (!program || !department || !subject || !semester || !year)
      return res.status(400).json({ message: "All fields required" });

    if (program === "MTECH" && !branch)
      return res.status(400).json({ message: "Branch required for MTECH" });

    const pyq = await PYQ.create({
      program,
      department,
      branch: program === "MTECH" ? branch : null,
      subject,
      semester,
      year,
      fileUrl: `/uploads/pyq/${req.file.filename}`,
      uploadedBy: "STUDENT",
      status: "PENDING",
      createdBy: req.user?._id || null,
    });

    res.json({
      message: "Uploaded successfully. Awaiting admin approval.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Student upload failed" });
  }
};

