// models/Factura.js
const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
  cedula: {
    type: String,
    required: true
  },
  productos: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventario",
        required: true
      },
      nombre: String,
      cantidad: Number,
      precioUnitario: Number
    }
  ],
  total: Number,
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Factura", facturaSchema);
