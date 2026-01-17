const Post = require("../models/Post");

/**
 * 🔓 PUBLIC FEED
 */
exports.getFeed = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isPublic: true };
    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .populate("author", "name role profilePhoto")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load feed" });
  }
};

/**
 * 🔐 CREATE POST
 */
exports.createPost = async (req, res) => {
    try {
      const { content, category, link } = req.body;
  
      if (!category || (!content && !req.file)) {
        return res
          .status(400)
          .json({ message: "Post must have text or image" });
      }
  
      const post = new Post({
        content,
        category,
        link,
        author: req.user._id,
        image: req.file ? `/uploads/posts/${req.file.filename}` : null,
      });
  
      await post.save();
  
      res.json(post);
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      res.status(500).json({ message: "Post creation failed" });
    }
  };
  

/**
 * ❤️ LIKE / UNLIKE (REAL-TIME)
 */
/**
 * 😍 MULTI REACTION (REAL-TIME)
 */
exports.reactPost = async (req, res) => {
    try {
      const { type } = req.body; // like | love | sad | angry
      const userId = req.user._id.toString();
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const reactionTypes = ["like", "love", "sad", "angry"];
      if (!reactionTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid reaction type" });
      }
  
      // Remove user from ALL reactions first
      reactionTypes.forEach((r) => {
        post.reactions[r] = post.reactions[r].filter(
          (id) => id.toString() !== userId
        );
      });
  
      // Toggle logic
      const alreadyReacted = post.reactions[type].some(
        (id) => id.toString() === userId
      );
  
      if (!alreadyReacted) {
        post.reactions[type].push(userId);
      }
  
      await post.save();
  
      // 🔥 REAL-TIME UPDATE
      const io = req.app.get("io");
      io.emit("post-reacted", {
        postId: post._id,
        reactions: {
          like: post.reactions.like.length,
          love: post.reactions.love.length,
          sad: post.reactions.sad.length,
          angry: post.reactions.angry.length,
        },
      });
  
      res.json({ success: true });
    } catch (err) {
      console.error("REACTION ERROR:", err);
      res.status(500).json({ message: "Reaction failed" });
    }
  };
  

/**
 * 🔁 SHARE COUNT (REAL-TIME)
 */
exports.sharePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    // 🔥 SOCKET.IO EVENT
    const io = req.app.get("io");
    io.emit("post-shared", {
      postId: post._id,
      shares: post.shares,
    });

    res.json({ message: "Shared" });
  } catch (err) {
    res.status(500).json({ message: "Share failed" });
  }
};
