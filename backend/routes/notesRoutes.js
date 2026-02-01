const express = require("express");
const axios = require("axios");
const router = express.Router();

const upload = require("../middleware/upload");
const NOTES = require("../models/NotesModel");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const {
  uploadNotesByAdmin,
  uploadNotesByStudent,
  filterNotes,
  getPendingNotes,
  approveNote,
  deleteNote,
} = require("../controllers/notesController");

// ================= ADMIN UPLOAD =================
router.post(
  "/upload",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  upload.single("file"),
  uploadNotesByAdmin
);

// ================= STUDENT UPLOAD =================
router.post(
  "/student-upload",
  protect,
  upload.single("file"),
  uploadNotesByStudent
);

// ================= USER FETCH (APPROVED ONLY) =================
router.get("/filter", filterNotes);

// ================= ADMIN – PENDING =================
router.get("/pending", protect, getPendingNotes);

// ================= ADMIN – APPROVE =================
router.put("/approve/:id", protect, approveNote);

// ================= VIEW / PREVIEW NOTES =================
router.get("/view/:id", async (req, res) => {
  try {
    const note = await NOTES.findById(req.params.id);
    if (!note) return res.status(404).send("Notes not found");

    const response = await axios.get(note.fileUrl, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    response.data.pipe(res);
  } catch (err) {
    console.error("NOTES VIEW ERROR:", err.message);
    res.status(500).send("Unable to preview notes");
  }
});

// ================= DOWNLOAD NOTES =================
router.get("/download/:id", async (req, res) => {
  try {
    const note = await NOTES.findById(req.params.id);
    if (!note) return res.status(404).send("Notes not found");

    const response = await axios.get(note.fileUrl, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${note.subject || "notes"}.pdf"`
    );

    response.data.pipe(res);
  } catch (err) {
    console.error("NOTES DOWNLOAD ERROR:", err.message);
    res.status(500).send("Download failed");
  }
});

// ================= DELETE =================
router.delete(
  "/delete/:id",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  deleteNote
);

module.exports = router;
