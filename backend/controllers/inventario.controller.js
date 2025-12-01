const Inventario = require("../models/Inventario");
const logger = require("../utils/logger");

const getInventario = async (req, res) => {
  try {
    const inventario = await Inventario.find();
    res.json(inventario);
  } catch (err) {
    logger.safeError("Error obteniendo inventario", { error: err.message });
    res.status(500).json({ error: "Error al obtener inventario" });
  }
};

const addInventario = async (req, res) => {
  const { nombre, categoria, cantidad, precio, estado, descripcion, ubicacion } = req.body;

  try {
    const nuevoItem = new Inventario({
      nombre, categoria, cantidad, precio, estado, descripcion, ubicacion
    });

    const guardado = await nuevoItem.save();

    logger.info("Nuevo producto creado", { 
        producto: nombre, 
        creadoPor: req.user.usuario 
    });

    res.status(201).json(guardado);
  } catch (err) {
    logger.safeError("Error guardando inventario", { error: err.message });
    res.status(500).json({ error: "Error al guardar en inventario" });
  }
};

module.exports = { getInventario, addInventario };