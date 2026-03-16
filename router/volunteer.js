const express = require("express");
const router = express.Router();
const Volunteer = require("../models/volunteer");

// ✅ Create New Volunteer
router.post("/volunteers", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();

    const created = newVolunteer.createdAt.toLocaleString();
    const updated = newVolunteer.updatedAt.toLocaleString();

    console.log(newVolunteer);

    res.status(201).json({
      success: true,
      message: "Volunteer registered successfully",
      data: {
        ...newVolunteer._doc,
        createdAt: created,
        updatedAt: updated,
      },
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
  }
});

// ✅ Get All Volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ✅ Get Single Volunteer by ID
router.get("/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ✅ Delete Volunteer
router.delete("/:id", async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
