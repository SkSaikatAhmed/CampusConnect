const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email registrationNo department branch program role profilePhoto createdAt isBanned bio phone location"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

exports.createStudentByAdmin = async (req, res) => {
  try {
    const data = {
      ...req.body,
      role: "STUDENT",
    };
    
    if (req.file) {
      data.profilePhoto = req.file.path; // or req.file.secure_url for Cloudinary
    }
    const student = await User.create(data);

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    console.error("Create student error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, registrationNo, password } = req.body;

    if (!name || !email || !registrationNo || !password) {
      return res.status(400).json({
        error: "Name, registration number, email and password are required",
      });
    }
    

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }


    const admin = await User.create({
      name,
      email,
      registrationNo,
      password, // DO NOT hash here
      role: "ADMIN",
    });
    

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ error: "Failed to create admin" });
  }
};

