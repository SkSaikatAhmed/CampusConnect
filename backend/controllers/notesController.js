const NOTES = require("../models/NotesModel");
const cloudinary = require("../config/cloudinary");

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

      const uploadResult = await cloudinary.uploader.upload(
        `data:application/pdf;base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "campusconnect/notes",
          resource_type: "raw",
        }
      );
      
      const notes = await NOTES.create({
        program,
        department,
        branch: program === "MTECH" ? branch : null,
        subject,
        semester,
        year,
        fileUrl: uploadResult.secure_url,
        uploadedBy: "ADMIN",
        status: "APPROVED",
        createdBy: req.user?._id || null,
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
  
      if (!req.file)
        return res.status(400).json({ message: "PDF required" });
  
      if (!program || !department || !subject || !semester || !year)
        return res.status(400).json({ message: "All fields required" });
  
      if (program === "MTECH" && !branch)
        return res.status(400).json({ message: "Branch required for MTECH" });
  
        const uploadResult = await cloudinary.uploader.upload(
          `data:application/pdf;base64,${req.file.buffer.toString("base64")}`,
          {
            folder: "campusconnect/notes",
            resource_type: "raw",
          }
        );
        
        const notes = await NOTES.create({
          program,
          department,
          branch: program === "MTECH" ? branch : null,
          subject,
          semester,
          year,
          fileUrl: uploadResult.secure_url,
          uploadedBy: "ADMIN",
          status: "APPROVED",
          createdBy: req.user?._id || null,
        });
        
  
      res.json({ message: "Uploaded. Awaiting approval." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  };
  
/* DELETE NOTE (ADMIN) */
exports.deleteNote = async (req, res) => {
  try {
    const note = await NOTES.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("DELETE NOTE ERROR:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
};
