const Inventario = require("../models/Inventario");
const Factura = require("../models/Factura");
const JWT = require("../jwt/jwt"); // Asegúrate de tener esta clase como en tu sistema

const facturarCliente = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];
  const jwt = new JWT();
  const decoded = jwt.decode({
    token,
    secret: process.env.JWT_SECRET || "mi_llave_secreta"
  });

  if (!decoded) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  // Continúa con la lógica de facturación
  const { cedula, productos } = req.body;

  if (!cedula || !Array.isArray(productos)) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const productosDetallados = [];

    for (const item of productos) {
      const productoDB = await Inventario.findById(item.id);
      if (!productoDB) {
        return res.status(404).json({ error: `Producto no encontrado con ID ${item.id}` });
      }
      if (productoDB.cantidad < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${productoDB.nombre}` });
      }

      productoDB.cantidad -= item.cantidad;
      await productoDB.save();

      productosDetallados.push({
        id: item.id,
        nombre: productoDB.nombre,
        cantidad: item.cantidad,
        precioUnitario: 1 // Ajusta si manejas precios
      });
    }

    const total = productosDetallados.reduce(
      (sum, p) => sum + p.precioUnitario * p.cantidad,
      0
    );

    const nuevaFactura = new Factura({
      cedula,
      productos: productosDetallados,
      total
    });

    const guardada = await nuevaFactura.save();
    res.status(201).json({ mensaje: "Factura generada con éxito", factura: guardada });
  } catch (err) {
    res.status(500).json({
      error: "Error al generar la factura",
      detalles: err.message
    });
  }
};

module.exports = { facturarCliente };
