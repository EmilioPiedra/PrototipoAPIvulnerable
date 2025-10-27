const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Token = require('../models/Token');

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d';

if (!JWT_SECRET) {
  console.warn('JWT_SECRET no está definido en env!');
}

function signAccessToken(userId, role) {
  const jti = uuidv4();
  const payload = {
    sub: userId,
    role
  };
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: ACCESS_EXPIRES, jwtid: jti });
  return { token, jti };
}

function signRefreshToken(userId) {
  const jti = uuidv4();
  const payload = { sub: userId, type: 'refresh' };
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: REFRESH_EXPIRES, jwtid: jti });
  return { token, jti };
}

const login = async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.status(400).json({ error: 'Faltan campos' });

  try {
    // Traer hash explícitamente
    const user = await User.findOne({ usuario }).select('+password');
    
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrecto' });

    const verified = await user.verifyPassword(password);
    if (!verified) return res.status(401).json({ error: 'Usuario o contraseña incorrecto' });

    // Si era legacy, migramos a bcrypt
    if (user.passwordAlgo === 'legacy') {
      try { await user.migratePasswordToBcrypt(password); } catch (e) { /* no bloquear login si falla migración */ }
    }

    const { token: accessToken, jti: accessJti } = signAccessToken(user._id.toString(), user._userInfo.rango);
    const { token: refreshToken, jti: refreshJti } = signRefreshToken(user._id.toString());

    // Guardar refresh token en DB para revocación
    const expiresAt = new Date(Date.now() + (7 * 24 * 3600 * 1000)); // 7d, mantener según REFRESH_EXPIRES
    await Token.create({ user: user._id, jti: refreshJti, expiresAt, revoked: false });

    // Devolver sólo datos seguros
    return res.json({
      accessToken,
      refreshToken,
      user: user.toSafeJSON()
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno', details: err.message });
  }
};

// endpoint para intercambiar refresh por access (rotación)
const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken requerido' });

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET, { algorithms: ['HS256'] });
    if (decoded.type !== 'refresh') return res.status(400).json({ error: 'Token inválido' });

    // buscar jti en DB y revisar revocado
    const jti = decoded.jti;
    const tokenDoc = await Token.findOne({ jti, user: decoded.sub });
    if (!tokenDoc || tokenDoc.revoked) return res.status(401).json({ error: 'Refresh token revocado o inválido' });

    // Rotar: revocar token actual y emitir nuevos tokens
    tokenDoc.revoked = true;
    await tokenDoc.save();

    const user = await User.findById(decoded.sub);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { token: newAccess, jti: newAccessJti } = signAccessToken(user._id.toString(), user._userInfo.rango);
    const { token: newRefresh, jti: newRefreshJti } = signRefreshToken(user._id.toString());

    const expiresAt = new Date(Date.now() + (7 * 24 * 3600 * 1000));
    await Token.create({ user: user._id, jti: newRefreshJti, expiresAt, revoked: false });

    return res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    return res.status(401).json({ error: 'Refresh token inválido o expirado', details: err.message });
  }
};

// logout: revocar refresh token específico (enviar refreshToken en body)
const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken requerido' });

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET, { algorithms: ['HS256'] });
    const tokenDoc = await Token.findOne({ jti: decoded.jti, user: decoded.sub });
    if (tokenDoc) {
      tokenDoc.revoked = true;
      await tokenDoc.save();
    }
    return res.json({ message: 'Sesión cerrada' });
  } catch (err) {
    return res.status(400).json({ error: 'Token inválido' });
  }
};

// endpoint simple para verificar access token y retornar claims
const getUserToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    return res.json({ message: 'Acceso autorizado', user: { sub: decoded.sub, role: decoded.role, exp: decoded.exp } });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};


module.exports = { login, refresh, logout, getUserToken };
