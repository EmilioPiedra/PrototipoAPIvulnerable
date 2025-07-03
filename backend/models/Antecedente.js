const mongoose = require("mongoose");

const antecedenteSchema = new mongoose.Schema({
  cedula: String,
  estado: String
});

module.exports = mongoose.model("Antecedente", antecedenteSchema);
