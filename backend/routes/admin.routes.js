// routes/admin.routes.js

const express = require('express');
const router = express.Router();
const { getUsers, actualizarUser,eliminarUser } = require('../controllers/admin.controller');

router.get('/users', getUsers);
router.put('/actualizar/:usuario', actualizarUser);
router.delete('/eliminar/:usuario', eliminarUser);
module.exports = router;