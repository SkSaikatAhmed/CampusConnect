const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
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

    await User.create({
      name,
      email,
      password, // ❗ DO NOT HASH HERE
      registrationNo,
      program,
      department,
      branch,
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

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isBanned) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registrationNo: user.registrationNo,
        program: user.program,
        department: user.department,
        branch: user.branch,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
        isBanned: user.isBanned,
      },
    });
    
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json(req.user); // already populated by middleware
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


const cloudinary = require("../config/cloudinary");

console.log("Cloudinary ready:", !!cloudinary.uploader);
