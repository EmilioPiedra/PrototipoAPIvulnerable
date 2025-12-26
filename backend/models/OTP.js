const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // El documento se auto-destruye en 300 segundos (5 min)
  }
});

module.exports = mongoose.model("OTP", otpSchema);