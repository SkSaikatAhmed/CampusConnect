const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const profileUpload = require("../middleware/profileUpload");
const User = require("../models/UserModel");
const { protect } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

router.put(
  "/profile-photo",
  protect,
  profileUpload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "campusconnect/profile",
          resource_type: "image",
        }
      );

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePhoto: uploadResult.secure_url },
        { new: true }
      );

      res.json({
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error("Profile upload error:", error);
      res.status(500).json({ message: "Profile upload failed" });
    }
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
