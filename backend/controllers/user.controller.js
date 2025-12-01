const User = require("../models/User");
const logger = require("../utils/logger");

const getUserById = async (req, res) => {
  const { id } = req.params;
  const requestingUser = req.user;

  try {
    if (requestingUser.id !== id && requestingUser._userInfo.rango !== 'admin') {
      logger.warn(`Intento de IDOR detectado`, { 
          atacante: requestingUser.usuario, 
          victimaID: id 
      });
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    logger.safeError("Error obteniendo usuario", { error: err.message });
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const requestingUser = req.user;
  const { correo, telefono } = req.body;

  try {
    if (requestingUser.id !== id && requestingUser._userInfo.rango !== 'admin') {
      logger.warn(`Intento de IDOR en Update detectado`, { 
          atacante: requestingUser.usuario, 
          victimaID: id 
      });
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { correo, telefono },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });

    logger.info("Perfil actualizado", { usuario: updatedUser.usuario });
    res.json({ message: "Perfil actualizado", user: updatedUser });
  } catch (err) {
    logger.safeError("Error actualizando perfil", { error: err.message });
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

module.exports = { getUserById, updateUserById };