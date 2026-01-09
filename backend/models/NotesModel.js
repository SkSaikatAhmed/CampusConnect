const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    program: String,
    department: String,
    branch: String, // null for non-MTECH
    subject: String,
    semester: Number,
    year: Number,
    fileUrl: String,

    uploadedBy: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NOTES", notesSchema);
