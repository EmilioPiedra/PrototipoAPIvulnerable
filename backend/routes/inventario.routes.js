const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getInventario, addInventario } = require('../controllers/inventario.controller');

// Middlewares
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

// Ver inventario: Permitido para usuarios y admins
router.get('/inventario', protect, getInventario);

// Agregar inventario: SOLO ADMIN
router.post('/addInventario',
    protect,
    authorize('admin'), // Solo admin crea productos
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('cantidad', 'La cantidad debe ser un número positivo').isInt({ min: 0 }),
        check('precio', 'El precio debe ser un número positivo').isFloat({ min: 0 })
    ],
    validateRequest,
    addInventario
);

module.exports = router;