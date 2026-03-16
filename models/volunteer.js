const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    phonenumber: {
      type: String,
      required: true,
      trim: true,
    },

    interests: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Volunteer", volunteerSchema, "volunteer");
