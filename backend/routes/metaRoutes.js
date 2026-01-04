const express = require("express");
const router = express.Router();
const Meta = require("../models/MetaModel");

// GET metadata by type
// Example: /api/meta/PROGRAM
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const filters = req.query || {};

    const data = await Meta.find({ type, ...filters }).sort({ value: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Meta fetch failed" });
  }
});

// ADD new metadata (ADMIN)
router.post("/", async (req, res) => {
  try {
    const { type, value, program, department } = req.body;

    if (!type || !value) {
      return res.status(400).json({ message: "Invalid meta data" });
    }

    const meta = await Meta.create({
      type,
      value,
      program: program || null,
      department: department || null,
    });

    res.json(meta);
  } catch (err) {
    res.status(400).json({ message: "Meta already exists" });
  }
});

module.exports = router;
