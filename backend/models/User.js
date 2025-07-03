const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  usuario: String,
  correo: String,
  cedula: String,
  telefono: String,
  password: String,
  createdAt: Date,
  _userInfo: {
    rango: String,
    creditos: Number
  }
});

module.exports = mongoose.model("User", userSchema);
