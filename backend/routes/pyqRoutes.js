const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadPYQ, getAllPYQ } = require("../controllers/pyqController");

router.post("/upload", upload.single("file"), uploadPYQ);
router.get("/get", getAllPYQ);

module.exports = router;
