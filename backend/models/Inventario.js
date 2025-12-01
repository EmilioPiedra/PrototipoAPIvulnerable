const mongoose = require("mongoose");

const inventarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"],
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: [0, "La cantidad no puede ser negativa"] // ¡SEGURIDAD! Lógica de negocio
  },
  precio: {
    type: Number,
    required: true,
    min: [0, "El precio no puede ser negativo"]
  },
  estado: {
    type: String,
    enum: ["disponible", "agotado", "descontinuado"], // Lista blanca de estados
    default: "disponible"
  },
  descripcion: {
    type: String,
    trim: true
  },
  ubicacion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Auditoría básica de creación/modificación
});

module.exports = mongoose.model("Inventario", inventarioSchema);