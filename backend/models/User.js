const mongoose = require("mongoose");

// Expresión regular optimizada (Tiempo Lineal - Anti ReDoS)
// Evita el backtracking catastrófico al no usar grupos anidados repetitivos.
const emailSafeRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
      emailSafeRegex,
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
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }
}, {
  timestamps: true 
});

module.exports = mongoose.model("usersSeguro", userSchema, "usersSeguro");