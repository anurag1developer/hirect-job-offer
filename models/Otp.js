const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: { type: Date, expires: 10 },
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
