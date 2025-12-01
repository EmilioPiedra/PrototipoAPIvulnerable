// Recibe una lista de roles permitidos, ej: authorize('admin', 'manager')
const authorize = (...rolesPermitidos) => {
    return (req, res, next) => {
        // 1. Verificar si req.user existe (Inyectado por auth.middleware)
        if (!req.user || !req.user._userInfo) {
            return res.status(401).json({ error: "No autorizado, usuario no identificado" });
        }

        // 2. Verificar si el rol del usuario está en la lista permitida
        // Asumimos que tu modelo User tiene: _userInfo: { rango: 'admin' }
        const userRole = req.user._userInfo.rango;

        if (!rolesPermitidos.includes(userRole)) {
            // 403 Forbidden: Sabes quién soy, pero no tengo permiso
            return res.status(403).json({ 
                error: "Acceso denegado: No tiene permisos suficientes para esta acción." 
            });
        }

        // 3. Tiene permiso, continuar
        next();
    };
};

module.exports = { authorize };