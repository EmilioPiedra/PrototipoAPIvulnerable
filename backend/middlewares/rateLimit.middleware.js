const rateLimit = require('express-rate-limit');

// 1. Limitador para Login/OTP (Aumentamos a 10 para evitar bloqueos por recarga)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, // Subimos de 5 a 10 para el flujo de 2FA
    message: {
        error: "Demasiados intentos de autenticación. Espere 15 minutos."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Limitador GENERAL (Relajado para el Dashboard)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, // Más amplio para el uso normal
    message: {
        error: "Límite de peticiones a la API excedido."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };