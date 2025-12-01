const User = require("../models/User");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

// GET /api/users (Solo Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    logger.safeError("Error al obtener usuarios (Admin)", { 
        admin: req.user.usuario, 
        error: err.message 
    });
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// PUT /api/actualizar/:usuario (Solo Admin)
const actualizarUser = async (req, res) => {
  const { usuario } = req.params;
  const { correo, cedula, telefono, _userInfo, password } = req.body;

  try {
    const userToUpdate = await User.findOne({ usuario });
    if (!userToUpdate) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizamos campos permitidos
    if (correo) userToUpdate.correo = correo;
    if (cedula) userToUpdate.cedula = cedula;
    if (telefono) userToUpdate.telefono = telefono;
    if (_userInfo) userToUpdate._userInfo = _userInfo;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }

    await userToUpdate.save();

    logger.info("Usuario actualizado por Admin", { 
        admin: req.user.usuario, 
        targetUser: usuario 
    });

    const userResponse = userToUpdate.toObject();
    delete userResponse.password;

    res.json({ message: "Usuario actualizado correctamente", user: userResponse });
  } catch (err) {
    logger.safeError("Error actualizando usuario", { error: err.message });
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// DELETE /api/eliminar/:usuario (Solo Admin)
const eliminarUser = async (req, res) => {
  const { usuario } = req.params;
  try {
    const deleted = await User.findOneAndDelete({ usuario });
    if (!deleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    logger.info("Usuario ELIMINADO por Admin", { 
        admin: req.user.usuario, 
        deletedUser: usuario 
    });

    res.json({ message: `Usuario ${usuario} eliminado correctamente` });
  } catch (err) {
    logger.safeError("Error eliminando usuario", { error: err.message });
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

module.exports = { getUsers, actualizarUser, eliminarUser };