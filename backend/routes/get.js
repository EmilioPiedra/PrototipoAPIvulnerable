const express = require('express');
const fs = require('fs');
const JWT = require('../jwt/jwt');
const router = express.Router();

// Endpoint vulnerable a BOLA: obtener info usuario por id numérico sin validar si el token corresponde a ese id
router.get('/user/:id', (req, res) => {
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: 'mi_llave_secreta' });
  if (!decoded) return res.status(401).json({ error: 'Token inválido o expirado' });

  const userId = parseInt(req.params.id, 10);
  

  // Leer usuarios desde el JSON
  const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

  // Aquí está la falla: no verificamos que decoded.payload.UUID corresponda al userId
  // Esto permite que con un token válido puedas pedir cualquier id y ver su info
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  return res.json(user);
});

router.put('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  // ❌ VULNERABLE: acepta cualquier campo, incluso _userInfo
  users[userIndex] = { ...users[userIndex], ...req.body };

  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

  return res.json(users[userIndex]);
});


module.exports = router;
