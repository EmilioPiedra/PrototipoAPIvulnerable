const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
// Importamos las nuevas funciones
const { loginStepOne, loginStepTwo, getUserToken } = require('../controllers/auth.controller');

// Middlewares
const { protect } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

// 1. LOGIN FASE 1: Credenciales (User/Pass) -> Devuelve TempToken
router.post('/login',
    authLimiter,
    [
        check('usuario', 'Usuario requerido').not().isEmpty(),
        check('password', 'Password requerido').not().isEmpty()
    ],
    validateRequest,
    loginStepOne // <--- Cambio aquí
);

// 2. LOGIN FASE 2: Verificación (TempToken + OTP) -> Devuelve JWT Final
router.post('/login/verify',
    authLimiter, // También protegemos este con rate limit
    [
        check('tempToken', 'Falta el token temporal').not().isEmpty(),
        check('otp', 'El código OTP es obligatorio').isLength({ min: 6, max: 6 })
    ],
    validateRequest,
    loginStepTwo // <--- Nueva función
);

// Ruta protegida normal
router.get('/protected', protect, getUserToken);

module.exports = router;