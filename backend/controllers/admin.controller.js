const express = require('express');
const fs = require('fs');
const JWT = require('../jwt/jwt');

// Obtener todos los usuarios
const getUsers = (req, res) => {
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
    const users = JSON.parse(fs.readFileSync('./data/users.json'));
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Error leyendo usuarios' });
  }
};

// Actualizar usuario completo (por ID o username)
const actualizarUser =  (req, res) => {
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

  const { usuario } = req.params;
  const newData = req.body;

  try {
    const users = JSON.parse(fs.readFileSync('./data/users.json'));
    const index = users.findIndex(u => u.usuario === usuario);

    if (index === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualiza los campos permitidos
    users[index] = { ...users[index], ...newData };

    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
    return res.json({ message: 'Usuario actualizado', user: users[index] });
  } catch (err) {
    return res.status(500).json({ error: 'Error actualizando usuario' });
  }
};

// Eliminar usuario por nombre de usuario
const eliminarUser = (req, res) => {
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

  const { usuario } = req.params;

  try {
    let users = JSON.parse(fs.readFileSync('./data/users.json'));
    const initialLength = users.length;
    users = users.filter(u => u.usuario !== usuario);

    if (users.length === initialLength) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
    return res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error eliminando usuario' });
  }
};


module.exports = {getUsers, actualizarUser, eliminarUser};  
