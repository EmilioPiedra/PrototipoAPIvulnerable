const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP, changePassword } = require('../controllers/otp.controller');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

// Aplicar el límite SOLO a los intentos de validación y solicitud
router.post('/request-otp', authLimiter, requestOTP);
router.post('/verify-otp', authLimiter, verifyOTP);
router.post('/change-password', authLimiter, changePassword);

module.exports = router;