const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "PROGRAM",
      "DEPARTMENT",
      "BRANCH",
      "SUBJECT",
      "SEMESTER"
    ],
    required: true,
  },

  value: {
    type: String,
    required: true,
  },

  program: {
    type: String,
    default: null, // used for BRANCH (MTECH only)
  },

  department: {
    type: String,
    default: null, // used for BRANCH
  },
});

metaSchema.index(
  { type: 1, value: 1, program: 1, department: 1 },
  { unique: true }
);

module.exports = mongoose.model("Meta", metaSchema);
