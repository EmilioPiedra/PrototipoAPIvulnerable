const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si existe el header "Authorization" y empieza con "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Obtener el token (quitar la palabra "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token usando la librería estándar
      // Esto valida automáticamente: Firma correcta, Expiración (exp) y Formato.
      // Si el token expiró o es falso, jwt.verify lanza un error (catch).
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Obtener el usuario del token
      // Usamos decoded.sub porque así lo definimos en el AuthController
      // .select('-password') asegura que NUNCA pase el hash al controlador
      req.user = await User.findById(decoded.sub).select('-password');

      if (!req.user) {
        return res.status(401).json({ error: "No autorizado, usuario no encontrado" });
      }

      // 5. ¡Todo bien! Pasamos al siguiente eslabón (el Controlador)
      next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "No autorizado, token inválido o expirado" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "No autorizado, no se proporcionó token" });
  }
};

module.exports = { protect };