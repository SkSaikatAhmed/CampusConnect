const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  subject: String,
  program: String,
  department: String,
  semester: Number,
  year: Number,
  fileUrl: String,

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  

  rejectionReason: {
    type: String,
    default: ""
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
});

module.exports = mongoose.model("Notes", notesSchema);
