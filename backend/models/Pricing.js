const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
    },

    planPrice: {
      type: Number,
      required: true,
    },

    planDescription: {
      type: String,
      required: true,
      trim: true,
    },

    planFeatures: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pricing", pricingSchema);