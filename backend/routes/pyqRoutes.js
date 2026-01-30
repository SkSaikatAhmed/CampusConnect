const express = require("express");
const axios = require("axios");
const router = express.Router();

const upload = require("../middleware/upload");
const PYQ = require("../models/PYQModel");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const {
  uploadPYQByAdmin,
  uploadPYQByStudent,
  filterPYQ,
  getPendingPYQ,
  approvePYQ,
  deletePYQ,
} = require("../controllers/pyqController");

// ================= ADMIN UPLOAD =================
router.post(
  "/upload",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  upload.single("file"),
  uploadPYQByAdmin
);

// ================= STUDENT UPLOAD =================
router.post(
  "/student-upload",
  protect,
  upload.single("file"),
  uploadPYQByStudent
);

// ================= USER FETCH (APPROVED ONLY) =================
router.get("/filter", filterPYQ);

// ================= ADMIN – PENDING =================
router.get("/pending", protect, getPendingPYQ);

// ================= ADMIN – APPROVE =================
router.put("/approve/:id", protect, approvePYQ);

// ================= VIEW / PREVIEW PYQ =================
router.get("/view/:id", async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) return res.status(404).send("PYQ not found");

    const response = await axios.get(pyq.fileUrl, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    response.data.pipe(res);
  } catch (err) {
    console.error("PYQ VIEW ERROR:", err.message);
    res.status(500).send("Unable to preview PYQ");
  }
});

// ================= DOWNLOAD PYQ =================
router.get("/download/:id", async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) return res.status(404).send("PYQ not found");

    const response = await axios.get(pyq.fileUrl, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pyq.subject || "pyq"}.pdf"`
    );

    response.data.pipe(res);
  } catch (err) {
    console.error("PYQ DOWNLOAD ERROR:", err.message);
    res.status(500).send("Download failed");
  }
});

// ================= DELETE =================
router.delete(
  "/delete/:id",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  deletePYQ
);

module.exports = router;
