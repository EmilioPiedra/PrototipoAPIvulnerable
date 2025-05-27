const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const JWT = require('../jwt/jwt');
const router = express.Router();

router.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  // Validar que usuario y password no estén vacíos
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Faltan campos: usuario o password' });
  }

  const users = JSON.parse(fs.readFileSync('./data/users.json'));

  // Hashear el password recibido
  const hashedPassword = crypto
    .createHmac('ripemd160', 'change_key_private_')
    .update(password)
    .digest('base64');  // directamente string base64

  // Buscar usuario con password seguro
  const user = users.find(u => {
    const storedBuffer = Buffer.from(u.password, 'base64');
    const inputBuffer = Buffer.from(hashedPassword, 'base64');

    if (storedBuffer.length !== inputBuffer.length) return false;

    return u.usuario === usuario &&
           crypto.timingSafeEqual(storedBuffer, inputBuffer);
  });

  if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrecto' });

  // Crear token JWT
  const uuid = crypto.randomBytes(20).toString('hex');
  const jwt = new JWT();
 const token = jwt.create({
  header: { alg: 'HS256', typ: 'JWT' },
  payload: {
    UUID: uuid,
    permiso: user._userInfo.rango
  },
  secret: 'mi_llave_secreta'
  }).get();
    return res.json({ token });
  });

router.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: 'mi_llave_secreta' });
  if (!decoded) return res.status(401).json({ error: 'Token inválido o expirado' });

  return res.json({ message: 'Acceso autorizado', user: decoded.payload });
});


module.exports = router;
