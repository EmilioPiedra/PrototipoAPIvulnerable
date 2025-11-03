// routes/compras.routes.js
const express = require("express");
const { createCompra, getCompras, getCompraById, deleteCompra } = require("../controllers/compra.controller");
const router = express.Router();

router.post("/compra", createCompra); // <- debe existir
router.get("/compra", getCompras);        // <- debe existir
router.get("/compra/:id", getCompraById);
router.delete("/compra/:id", deleteCompra);

module.exports = router;
