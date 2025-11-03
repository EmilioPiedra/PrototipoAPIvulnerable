const mongoose = require("mongoose");

const ProductoCompradoSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventario" },
  nombre: String,
  precio: Number,
  cantidad: Number,
});

const CompraSchema = new mongoose.Schema({
  UUID: { type: String, required: true },        // <-- UUID del usuario
  usuario: { type: String, required: true },     // <-- nombre de usuario
  permiso: { type: String, default: "sin_permiso" },
  productos: [ProductoCompradoSchema],
  total: { type: Number, default: 0 },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Compra", CompraSchema);
