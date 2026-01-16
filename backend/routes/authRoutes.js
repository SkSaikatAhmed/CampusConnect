const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const profileUpload = require("../middleware/profileUpload");
const { protect } = require("../middleware/authMiddleware");

// Student registration
router.post(
  "/register",
  profileUpload.single("profilePhoto"),
  authController.registerStudent
);

// Login
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);

module.exports = router;

