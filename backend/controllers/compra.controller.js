// controllers/compraController.js
const Compra = require("../models/Compra");
const JWT = require("../jwt/jwt");

// ✅ Crear una nueva compra (insegura — solo decodifica token)
const createCompra = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let decodedPayload = {};

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const jwt = new JWT();
      const decoded = jwt.decode({
        token,
        secret: process.env.JWT_SECRET || "mi_llave_secreta",
      });
      decodedPayload = decoded?.payload || {};
    }

    const { productos, total } = req.body;

    const nuevaCompra = new Compra({
      UUID: decodedPayload?.UUID || "anon",
      usuario: decodedPayload?.usuario || "anon",
      permiso: decodedPayload?.permiso || "sin_permiso",
      productos,
      total,
      fecha: new Date(),
    });

    const compraGuardada = await nuevaCompra.save();
    res.json({ message: "Compra registrada (inseguro)", compra: compraGuardada });
  } catch (error) {
    console.error("Error creando compra:", error);
    res.status(500).json({ error: "Error al crear compra", details: error.message });
  }
};

// ✅ Obtener compras filtradas por UUID (inseguro — sin verificar firma)
const getCompras = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let userUUID = null;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const jwt = new JWT();
      const decoded = jwt.decode({
        token,
        secret: process.env.JWT_SECRET || "mi_llave_secreta",
      });
      userUUID = decoded?.payload?.UUID || null;
    }

    // Solo trae compras del usuario
    const compras = userUUID
      ? await Compra.find({ UUID: userUUID }).sort({ fecha: -1 })
      : await Compra.find().sort({ fecha: -1 });

    res.json(compras);
  } catch (error) {
    console.error("Error en getCompras:", error);
    res.status(500).json({ error: "Error al obtener compras", details: error.message });
  }
};

// ✅ Obtener una compra por ID
const getCompraById = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });
    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener compra", details: error.message });
  }
};

// ✅ Eliminar una compra por ID
const deleteCompra = async (req, res) => {
  try {
    const compra = await Compra.findByIdAndDelete(req.params.id);
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });
    res.json({ message: "Compra eliminada correctamente", compra });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar compra", details: error.message });
  }
};

module.exports = {
  createCompra,
  getCompras,
  getCompraById,
  deleteCompra,
};
