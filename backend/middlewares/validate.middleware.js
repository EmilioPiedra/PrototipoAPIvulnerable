const { validationResult } = require('express-validator');

// Este middleware "atrapa" los errores que generan las reglas de validación en las rutas
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Si hay errores, devolvemos 400 Bad Request y la lista de fallos
        return res.status(400).json({ 
            error: "Datos de entrada inválidos", 
            detalles: errors.array() 
        });
    }
    
    next();
};

module.exports = { validateRequest };