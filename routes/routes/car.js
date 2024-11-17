const express = require("express");
const Car = require("../models/Car");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/", authMiddleware, upload.array("images", 10), async (req, res) => {
  const { title, description, tags } = req.body;
  const imageUrls = req.files.map((file) => file.path);
  try {
    const car = await Car.create({
      userId: req.user._id,
      title,
      description,
      tags: tags.split(","),
      images: imageUrls,
    });
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const cars = await Car.find({ userId: req.user._id });
  res.status(200).json(cars);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ message: "Car not found" });
  res.status(200).json(car);
});

router.patch("/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  const updates = { ...req.body };
  if (req.files.length) {
    updates.images = req.files.map((file) => file.path);
  }
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/search", authMiddleware, async (req, res) => {
  const query = req.query.q;
  const cars = await Car.find({
    $or: [
      { title: new RegExp(query, "i") },
      { description: new RegExp(query, "i") },
      { tags: new RegExp(query, "i") },
    ],
  });
  res.status(200).json(cars);
});

module.exports = router;
