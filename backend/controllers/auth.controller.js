const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../security/jwt");
const { validationResult } = require("express-validator");

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

  const { usuario, password } = req.body;

  try {
    const user = await User.findOne({ usuario });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // comparar contraseña con bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = generateToken(user);

    return res.json({
      token,
      usuario: {
        _id: user._id,
        usuario: user.usuario,
        correo: user.correo,
        rango: user._userInfo.rango,
        createdAt: user.createdAt,
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Error interno", details: err.message });
  }
};

module.exports = { login };
