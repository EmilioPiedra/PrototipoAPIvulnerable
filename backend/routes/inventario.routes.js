// routes/inventario.routes.js

const express = require('express');
const router = express.Router();
const { getInventario , addInventario} = require('../controllers/inventario.controller');

router.get('/inventario', getInventario);
router.post("/addInventario", addInventario);
module.exports = router;    