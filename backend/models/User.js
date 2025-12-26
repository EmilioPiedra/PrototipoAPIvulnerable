const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: [true, "El usuario es obligatorio"],
    trim: true,
    unique: true
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    trim: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, ingrese un correo válido"
    ]
  },
  cedula: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    select: false // ¡SEGURIDAD! Nunca devuelve el password en consultas por defecto
  },
  _userInfo: {
    rango: {
      type: String,
      enum: ["user", "admin"], // ¡SEGURIDAD! Lista blanca de roles permitidos
      default: "user"
    },
    creditos: {
      type: Number,
      default: 0,
      min: 0 // Evita números negativos
    }
  },
  // Campos para bloquear cuenta por fuerza bruta (Opcional pero recomendado)
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model("usersSeguro", userSchema, "usersSeguro");