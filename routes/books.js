const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { title, author, category } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Please provide a title." });
    }

    const book = await Book.create({ title, author, category });
    return res.status(201).json({ message: "Book added", book });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Could not add the book." });
  }
});


router.get("/", async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      error: "Page must be positive and limit must be between 1 and 100."
    });
  }

  try {
    const [books, total] = await Promise.all([
      Book.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Book.countDocuments()
    ]);

    return res.json({ page, limit, total, books });
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve books." });
  }
});


router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { available } = req.body || {};

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Please provide a valid book ID." });
  }

  if (typeof available !== "boolean") {
    return res.status(400).json({
      error: "Available must be true or false."
    });
  }

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { available },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    return res.json({ message: "Availability updated", book });
  } catch (error) {
    return res.status(500).json({ error: "Could not update the book." });
  }
});

module.exports = router;