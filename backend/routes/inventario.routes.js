// routes/inventario.routes.js

const express = require('express');
const router = express.Router();
const { getInventario , addInventario} = require('../controllers/inventario.controller');
const { authenticate } = require('../middlewares/auth.js');

router.get('/inventario', authenticate, getInventario);
router.post("/addInventario", authenticate , addInventario);
module.exports = router;    