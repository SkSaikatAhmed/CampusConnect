const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files allowed"), false);
  } else {
    cb(null, true);
  }
};

module.exports = multer({ storage, fileFilter });
