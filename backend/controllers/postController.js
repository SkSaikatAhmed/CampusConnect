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

    if (!content || !category) {
      return res
        .status(400)
        .json({ message: "Content and category required" });
    }

    const post = new Post({
      content,
      category,
      link,
      author: req.user._id,
    });

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Post creation failed" });
  }
};

/**
 * ❤️ LIKE / UNLIKE (REAL-TIME)
 */
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.map(id => id.toString()).indexOf(userId);

    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    await post.save();

    // 🔥 SOCKET.IO EVENT
    const io = req.app.get("io");
    io.emit("post-liked", {
      postId: post._id,
      likes: post.likes.length,
    });

    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Like failed" });
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
