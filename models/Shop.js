const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    ownerPhone: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    pincode: { type: Number, required: true, trim: true },
    products: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
