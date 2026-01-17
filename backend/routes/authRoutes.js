const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const profileUpload = require("../middleware/profileUpload");
const User = require("../models/UserModel");
const { protect } = require("../middleware/authMiddleware");

// ✅ UPDATE PROFILE PHOTO
router.put(
  "/profile-photo",
  protect,
  profileUpload.single("photo"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const photoPath = `/uploads/profile/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoPath },
      { new: true }
    );

    res.json({
      profilePhoto: user.profilePhoto,
    });
  }
);

// Student registration
router.post(
  "/register",
  profileUpload.single("profilePhoto"),
  authController.registerStudent
);

// Login & Me
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);

module.exports = router;
