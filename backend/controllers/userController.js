const User = require("../models/UserModel");

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
