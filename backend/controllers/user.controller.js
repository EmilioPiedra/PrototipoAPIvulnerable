const JWT = require("../jwt/jwt");
const User = require("../models/User"); 

// GET /user/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(user.toSafeJSON ? user.toSafeJSON() : user);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno', details: err.message });
  }
};

// PUT /user/:id (whitelist)
const updateUserById = async (req, res) => {
  try {
    // Campos permitidos a actualizar por el propio usuario
    const allowed = ['usuario', 'email'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Si el usuario quiere cambiar contraseña: endpoint separado /user/:id/change-password
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nada para actualizar o campos no permitidos' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password -__v');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(user.toSafeJSON ? user.toSafeJSON() : user);
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar', details: err.message });
  }
};


module.exports = { getUserById, updateUserById };