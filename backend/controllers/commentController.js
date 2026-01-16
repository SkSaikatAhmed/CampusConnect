const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!postId || !text) {
      return res.status(400).json({ message: "PostId and text required" });
    }

    const comment = new Comment({
      post: postId,
      user: req.user._id,
      text,
    });

    await comment.save();

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    // 🔥 SOCKET.IO EVENT
    const io = req.app.get("io");
    io.to(postId).emit("new-comment", {
      _id: comment._id,
      post: postId,
      text: comment.text,
      createdAt: comment.createdAt,
      user: {
        _id: req.user._id,
        name: req.user.name,
        profilePhoto: req.user.profilePhoto,
      },
    });

    res.json(comment);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: "Comment failed" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name profilePhoto")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load comments" });
  }
};
