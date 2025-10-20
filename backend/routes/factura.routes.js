// routes/factura.js
const express = require("express");
const router = express.Router();
const { facturarCliente } = require("../controllers/factura.controller");

router.post("/factura", facturarCliente);

module.exports = router;
