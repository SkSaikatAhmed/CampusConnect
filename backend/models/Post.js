const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "GENERAL",
        "ANNOUNCEMENT",
        "LOST_ITEM",
        "EVENT",
        "SPORTS",
        "CODING",
        "HOSTEL",
        "AWARENESS",
        "HELP",
        "PLACEMENT",
        "FEST",
        "COMPETITION",
      ],
      required: true,
    },

    link: {
      type: String, // external link (publicly visible)
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    isPublic: {
      type: Boolean,
      default: true, // outsiders can see
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
