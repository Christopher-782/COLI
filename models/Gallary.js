const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  alt_text: { type: String },
  category: { type: String },
  title: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("Gallary", gallerySchema, "gallary");
