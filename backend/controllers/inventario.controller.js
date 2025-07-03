const JWT = require("../jwt/jwt");
const Inventario = require("../models/Inventario"); // Modelo de Mongo

const getInventario = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];
  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: process.env.JWT_SECRET || "mi_llave_secreta" });

  if (!decoded) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  try {
    const inventario = await Inventario.find(); // Consulta a Mongo
    return res.json(inventario);
  } catch (err) {
    return res.status(500).json({
      error: "Error extrayendo el inventario desde MongoDB",
      details: err.message,
    });
  }
};

module.exports = { getInventario };
