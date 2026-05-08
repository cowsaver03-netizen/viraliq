const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  },

  plan: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    default: 0,
  },

  paymentMethod: {
    type: String,
    enum: ["online", "cash"],
    default: "online",
  },

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model("Customer", customerSchema);