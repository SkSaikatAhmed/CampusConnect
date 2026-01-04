const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const profileUpload = require("../middleware/profileUpload");

// Student registration
router.post(
  "/register",
  profileUpload.single("profilePhoto"),
  authController.registerStudent
);

// Login
router.post("/login", authController.login);

module.exports = router;
