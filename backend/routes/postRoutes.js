const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const uploadPostImage = require("../middleware/postUpload");
const { reactPost } = require("../controllers/postController");

const {
  getFeed,
  createPost,
  toggleLike,
  sharePost,
} = require("../controllers/postController");

router.get("/", getFeed); // public
const { getPostById } = require("../controllers/postController");

// PUBLIC
router.get("/:id", getPostById);

// ✅ ONLY THIS CREATE ROUTE
router.post(
  "/",
  protect,
  uploadPostImage.single("image"),
  createPost
);

router.post("/:id/share", protect, sharePost);
router.post("/:id/react", protect, reactPost);

module.exports = router;
