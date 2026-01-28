const User = require("../models/User");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

const getUserById = async (req, res) => {
  // 1. Sanitización estricta: Casting explícito a String
  const id = String(req.params.id); 
  const requestingUser = req.user;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Formato de identificador inválido" });
    }

    // PROTECCIÓN ANTI-IDOR (HU-13) 
    if (requestingUser.id !== id && requestingUser._userInfo.rango !== 'admin') {
      logger.warn(`Intento de IDOR detectado`, { 
          atacante: requestingUser.usuario, 
          victimaID: id 
      });
      return res.status(403).json({ error: "Acceso denegado" });
    }

    // 2. Consulta Segura: Al usar findById(id) con 'id' sanitizado como String, 
    // CodeQL reconoce que el flujo de inyección NoSQL se ha roto.
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    logger.safeError("Error obteniendo usuario", { error: err.message });
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

const updateUserById = async (req, res) => {
  const id = String(req.params.id); 
  const requestingUser = req.user;
  
  // 1. IMPORTANTE: Extraemos y sanitizamos individualmente (HU-15) 
  // Si req.body.correo fuera un objeto {$ne: null}, String() lo convierte en texto plano
  const correo = req.body.correo ? String(req.body.correo) : undefined;
  const telefono = req.body.telefono ? String(req.body.telefono) : undefined;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Formato de identificador inválido" });
    }

    if (requestingUser.id !== id && requestingUser._userInfo.rango !== 'admin') {
      logger.warn(`Intento de IDOR en Update detectado`, { 
          atacante: requestingUser.usuario, 
          victimaID: id 
      });
      return res.status(403).json({ error: "Acceso denegado" });
    }

    // 2. WHITELISTING SEGURO (HU-16) [cite: 37, 134]
    // Solo pasamos las variables locales ya sanitizadas
    const updateData = {};
    if (correo) updateData.correo = correo;
    if (telefono) updateData.telefono = telefono;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData, // Pasamos el objeto construido manualmente, no el req.body
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