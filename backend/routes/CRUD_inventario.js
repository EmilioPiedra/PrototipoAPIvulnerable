const express = require('express');
const fs = require('fs');
const JWT = require('../jwt/jwt');
const router = express.Router();

router.get('/inventario', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado, falta token' });
  }

  const token = authHeader.split(' ')[1];
  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: 'mi_llave_secreta' });

  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  try {
    const inventario = JSON.parse(fs.readFileSync('./data/inventario.json'));
    return res.json(inventario);
  } catch (err) {
    return res.status(500).json({ error: 'Error extrayendo el inventario', details: err.message });
  }
});



module.exports = router;