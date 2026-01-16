const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addComment,
  getComments,
} = require("../controllers/commentController");

router.get("/:postId", getComments);   // public
router.post("/", protect, addComment); // protected

module.exports = router;
