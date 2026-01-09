const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = "uploads/pyq";

    // Detect NOTES route
    if (req.originalUrl.includes("/notes")) {
      uploadDir = "uploads/notes";
    }

    // Ensure directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files allowed"), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
