const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const PYQ = require("../models/PYQModel");
const Notes = require("../models/NotesModel");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// CREATE ADMIN (SUPER ONLY)
router.post("/create-admin", protect, allowRoles("SUPER_ADMIN"), async (req, res) => {
  const admin = await User.create({ ...req.body, role: "ADMIN" });
  res.json(admin);
});

// REMOVE USER (ADMIN + SUPER)
router.delete("/remove-user/:id", protect, allowRoles("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user.role === "SUPER_ADMIN")
    return res.status(403).json({ message: "Not allowed" });

  if (user.role === "ADMIN" && req.user.role !== "SUPER_ADMIN")
    return res.status(403).json({ message: "Only super admin can remove admin" });

  await user.deleteOne();
  res.json({ message: "User removed" });
});

// Get all users (for admin dashboard)
router.get("/users", protect, allowRoles("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ban/Unban user
router.put("/users/:id/ban", protect, allowRoles("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't allow banning SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({ error: "Cannot ban SUPER_ADMIN" });
    }

    // Don't allow admin to ban other admins (only super admin can)
    if (user.role === "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Only super admin can ban other admins" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete("/users/:id", protect, allowRoles("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't allow deleting SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({ error: "Cannot delete SUPER_ADMIN" });
    }

    // Don't allow admin to delete other admins (only super admin can)
    if (user.role === "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Only super admin can delete other admins" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get PYQ stats
router.get("/pyq/stats", protect, allowRoles("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  try {
    const total = await PYQ.countDocuments();
    const approved = await PYQ.countDocuments({ status: "APPROVED" });
    const pending = await PYQ.countDocuments({ status: "PENDING" });
    const rejected = await PYQ.countDocuments({ status: "REJECTED" });

    res.json({ total, approved, pending, rejected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Notes stats
router.get("/notes/stats", protect, allowRoles("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  try {
    const total = await Notes.countDocuments();
    const approved = await Notes.countDocuments({ status: "APPROVED" });
    const pending = await Notes.countDocuments({ status: "PENDING" });
    const rejected = await Notes.countDocuments({ status: "REJECTED" });

    res.json({ total, approved, pending, rejected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all dashboard stats in one call
router.get("/dashboard-stats", protect, allowRoles("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  try {
    const [
      users,
      pyqs,
      notes,
      pendingPYQs,
      pendingNotes
    ] = await Promise.all([
      User.find({}, { password: 0 }),
      PYQ.find(),
      Notes.find(),
      PYQ.find({ status: "PENDING" }),
      Notes.find({ status: "PENDING" })
    ]);

    const totalStudents = users.filter(u => u.role === "STUDENT").length;
    const totalAdmins = users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;
    const bannedUsers = users.filter(u => u.isBanned).length;
    
    const approvedPYQs = pyqs.filter(p => p.status === "APPROVED").length;
    const approvedNotes = notes.filter(n => n.status === "APPROVED").length;

    res.json({
      totalUsers: users.length,
      totalStudents,
      totalAdmins,
      pendingPYQs: pendingPYQs.length,
      pendingNotes: pendingNotes.length,
      approvedPYQs,
      approvedNotes,
      bannedUsers,
      activeToday: users.length // You can implement session tracking later
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;