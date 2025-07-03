const mongoose = require("mongoose");

const inventarioSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  cantidad: Number,
  estado: String,
  descripcion: String,
  ubicacion: String,
});

module.exports = mongoose.model("Inventario", inventarioSchema);
