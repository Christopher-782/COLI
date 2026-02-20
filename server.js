const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const Gallery = require("./models/Gallary.js");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => {
    console.log("Failed To Connect To Db", err.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET route to fetch gallery images
app.get("/Coli/gallary", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ _id: 1 }); // sort oldest to newest
    res.json(images);
  } catch (err) {
    console.error("Error fetching gallery:", err);
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
