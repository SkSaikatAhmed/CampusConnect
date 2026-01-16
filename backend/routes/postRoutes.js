const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getFeed,
  createPost,
  toggleLike,
  sharePost,
} = require("../controllers/postController");

router.get("/", getFeed);              // public
router.post("/", protect, createPost);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/share", protect, sharePost);

module.exports = router;
