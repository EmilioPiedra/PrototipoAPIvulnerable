// routes/inventario.routes.js

const express = require('express');
const router = express.Router();
const { getInventario } = require('../controllers/inventario.controller');

router.get('/inventario', getInventario);

module.exports = router;    