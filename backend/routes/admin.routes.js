const express = require('express');
const router = express.Router();
const { getUsers, actualizarUser, eliminarUser } = require('../controllers/admin.controller');

// Middlewares
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Todas las rutas de este archivo requieren ser ADMIN
// Usamos router.use para aplicarlo a todo el archivo de una vez
router.use(protect); 
router.use(authorize('admin')); 

// GET /api/users
router.get('/users', getUsers);

// PUT /api/actualizar/:usuario
router.put('/actualizar/:usuario', actualizarUser);

// DELETE /api/eliminar/:usuario
router.delete('/eliminar/:usuario', eliminarUser);

module.exports = router;