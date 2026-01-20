const Post = require("../models/Post");

/**
 * 🔓 PUBLIC FEED
 */
exports.getFeed = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const filter = { isPublic: true };
    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .populate("author", "name role profilePhoto")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load feed" });
  }
};


/**
 * 🔐 CREATE POST
 */
const cloudinary = require("../config/cloudinary");

/**
 * 🔐 CREATE POST (Cloudinary)
 */
exports.createPost = async (req, res) => {
  try {
    const { content, category, link } = req.body;

    if (!category || (!content && !req.file)) {
      return res
        .status(400)
        .json({ message: "Post must have text or image" });
    }

    let imageUrl = null;

    // 🔥 Upload image to Cloudinary if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "campusconnect/posts",
          resource_type: "image",
        }
      );

      imageUrl = result.secure_url;
    }

    const post = new Post({
      content,
      category,
      link,
      author: req.user._id,
      image: imageUrl, // ✅ Cloudinary URL
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
    const { type } = req.body; // like | love | sad | angry | null
    const userId = req.user._id.toString();

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reactionTypes = ["like", "love", "sad", "angry"];

    // 🔥 REMOVE user from ALL reactions first (always)
    reactionTypes.forEach((r) => {
      post.reactions[r] = post.reactions[r].filter(
        (id) => id.toString() !== userId
      );
    });

    // 🔥 If type is null → this is a WITHDRAW
    if (type && reactionTypes.includes(type)) {
      post.reactions[type].push(userId);
    }

    await post.save();

    // 🔁 REAL-TIME UPDATE
    const io = req.app.get("io");
    io.emit("post-reacted", {
      postId: post._id,
      reactions: post.reactions,
      userId,
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
  // Share handled fully on frontend (Web Share API)
  res.json({ success: true });
};

/**
 * 🔓 GET SINGLE POST (PUBLIC)
 */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name role profilePhoto");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};
