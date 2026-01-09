const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadNotes,
  getAllNotes,
  studentUploadNotes,
} = require("../controllers/notesController");

router.post("/upload", upload.single("file"), uploadNotes);
router.post("/student-upload", upload.single("file"), studentUploadNotes);
router.get("/get", getAllNotes);

router.get("/filter", async (req, res) => {
  const NOTES = require("../models/NotesModel");
  const query = { status: "APPROVED" };

  Object.keys(req.query).forEach(k => {
    if (req.query[k]) query[k] = isNaN(req.query[k]) ? req.query[k] : Number(req.query[k]);
  });

  const data = await NOTES.find(query).sort({ year: -1 });
  res.json(data);
});

module.exports = router;
