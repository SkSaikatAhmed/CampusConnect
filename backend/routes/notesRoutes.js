const axios = require("axios");

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const NOTES = require("../models/NotesModel");
const { protect, allowRoles  } = require("../middleware/authMiddleware");
const {
  uploadNotes,
  getAllNotes,
  studentUploadNotes,
} = require("../controllers/notesController");

// Uploads
router.post("/upload", upload.single("file"), uploadNotes);
router.post("/student-upload", protect, upload.single("file"), studentUploadNotes);
router.get("/get", getAllNotes);

// ✅ STUDENT COUNT (APPROVED ONLY)
router.get("/my/count", protect, async (req, res) => {
  const count = await NOTES.countDocuments({
    createdBy: req.user._id,
    status: "APPROVED",
  });
  res.json({ count });
});

// ✅ ADMIN – Pending Notes
router.get("/pending", protect, async (req, res) => {
  const data = await NOTES.find({ status: "PENDING" })
    .populate("createdBy", "name registrationNo email");
  res.json(data);
});

// ADMIN – Approve
router.put("/approve/:id", protect, async (req, res) => {
  await NOTES.findByIdAndUpdate(req.params.id, {
    status: "APPROVED",
    rejectionReason: null,
  });
  res.json({ message: "Approved" });
});

// ADMIN – Reject
router.put("/reject/:id", protect, async (req, res) => {
  await NOTES.findByIdAndUpdate(req.params.id, {
    status: "REJECTED",
    rejectionReason: req.body.reason || "Not suitable",
  });
  res.json({ message: "Rejected" });
});

// Filter (Approved only)
router.get("/filter", async (req, res) => {
  const query = { status: "APPROVED" };

  Object.keys(req.query).forEach(k => {
    if (req.query[k]) {
      query[k] = isNaN(req.query[k]) ? req.query[k] : Number(req.query[k]);
    }
  });

  const data = await NOTES.find(query).sort({ year: -1 });
  res.json(data);
});
// ✅ VIEW / PREVIEW NOTES (PDF INLINE)
router.get("/view/:id", async (req, res) => {
  try {
    const note = await NOTES.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Notes not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    const response = await axios.get(note.fileUrl, {
      responseType: "stream",
    });

    response.data.pipe(res);
  } catch (error) {
    console.error("NOTES VIEW ERROR:", error.message);
    res.status(500).send("Unable to preview notes");
  }
});
// ⬇️ DOWNLOAD NOTES (FORCED DOWNLOAD)
router.get("/download/:id", async (req, res) => {
  try {
    const note = await NOTES.findById(req.params.id);
    if (!note) return res.status(404).send("Notes not found");

    const response = await axios.get(note.fileUrl, {
      responseType: "stream",
    });

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
router.delete(
  "/delete/:id",
  protect,
  allowRoles("admin"),
  deleteNote
);


module.exports = router;
