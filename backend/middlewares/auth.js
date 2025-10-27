const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no encontrado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { id: decoded.sub, role: decoded.role, jti: decoded.jti };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// authorizeOwnerOrRole('id', ['admin'])
function authorizeOwnerOrRole(paramIdName = 'id', roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' });
    const resourceId = req.params[paramIdName];
    if (!resourceId) return res.status(400).json({ error: 'id de recurso faltante' });

    if (req.user.id === resourceId) return next();
    if (roles.includes(req.user.role)) return next();

    return res.status(403).json({ error: 'Acceso denegado' });
  };
}

module.exports = { authenticate, authorizeOwnerOrRole };
