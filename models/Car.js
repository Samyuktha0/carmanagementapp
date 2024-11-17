const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  images: { type: [String], validate: [(val) => val.length <= 10, "Max 10 images"] },
});

module.exports = mongoose.model("Car", CarSchema);
