const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getInventario, addInventario } = require('../controllers/inventario.controller');

// Middlewares
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

// --- CORRECCIÓN 1: NO USAR authLimiter AQUÍ ---
// (Usamos solo el global de 100 peticiones que está en index.js)

// --- CORRECCIÓN 2: PERMISOS ---

// 1. Ver inventario (GET)
// Solo 'protect'. CUALQUIER usuario logueado puede ver.
// NO ponemos authorize('admin') aquí.
router.get('/inventario', protect, getInventario);

// 2. Agregar ítems (POST)
// Aquí SÍ exigimos ser ADMIN.
router.post('/addInventario',
    protect,
    authorize('admin'), // <--- Solo el admin puede crear
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('cantidad', 'La cantidad debe ser un número positivo').isInt({ min: 0 }),
        check('precio', 'El precio debe ser un número positivo').isFloat({ min: 0 })
    ],
    validateRequest,
    addInventario
);

module.exports = router;