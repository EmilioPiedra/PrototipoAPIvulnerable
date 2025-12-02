const rateLimit = require('express-rate-limit');

// 1. Limitador ESTRICTO para Login/OTP (Fuerza Bruta)
// "Solo 5 intentos cada 15 minutos por IP"
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 5 peticiones
    message: {
        error: "Demasiados intentos de inicio de sesión. Por seguridad, espere 15 minutos."
    },
    standardHeaders: true, // Retorna info de límites en los headers `RateLimit-*`
    legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*` antiguos
});

// 2. Limitador GENERAL para la API (DoS)
// "Máximo 100 peticiones cada 15 minutos por IP"
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Ha excedido el límite de peticiones a la API."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };