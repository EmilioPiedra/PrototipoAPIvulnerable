const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/users', (req, res) => {
  // No hay validación del rol, es vulnerable intencionalmente
  const users = JSON.parse(fs.readFileSync('./data/users.json'));
  res.json(users);
});

module.exports = router;