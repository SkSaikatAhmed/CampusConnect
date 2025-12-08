const mongoose = require("mongoose");

const pyqSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    enum: [
      "CSE",
      "ECE",
      "EE",
      "ME",
      "CE",
      "Math",
      "Physics",
      "Chemistry",
    ],
  },
  course: {
    type: String,
    required: true,
    enum: ["B.Tech", "M.Tech", "M.Sc"],
  },
  subject: { 
    type: String, 
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("PYQ", pyqSchema);
