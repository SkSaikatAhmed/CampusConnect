const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    registrationNo: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "STUDENT"],
      default: "STUDENT",
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
    // Optional academic info
    program: {
      type: String,
      enum: ["BTECH", "MTECH", "MCA", "MBA"],
    },

    department: String,

    branch: String, // only if MTECH

    profilePhoto: String, // file path
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
