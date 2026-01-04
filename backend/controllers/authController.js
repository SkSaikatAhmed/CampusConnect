const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      registrationNo,
      program,
      department,
      branch,
    } = req.body;

    if (!name || !email || !password || !registrationNo) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await User.findOne({
      $or: [{ email }, { registrationNo }],
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or Registration No already exists" });
    }

    if (program === "MTECH" && !branch) {
      return res
        .status(400)
        .json({ message: "Branch required for MTECH" });
    }

    const user = await User.create({
      name,
      email,
      password,
      registrationNo,
      program,
      department,
      branch: program === "MTECH" ? branch : null,
      profilePhoto: req.file
        ? `/uploads/profile/${req.file.filename}`
        : null,
      role: "STUDENT",
    });

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};
