const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    subject: String,
    program: String,
    department: String,
    branch: String,

    semester: Number,
    year: Number,

    fileUrl: String,

    uploadedBy: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // ✅ needed for createdAt sorting
);

module.exports = mongoose.model("Notes", notesSchema); // ✅ CRITICAL
