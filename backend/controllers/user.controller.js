const User = require("../models/User");
const logger = require("../utils/logger");
const mongoose = require("mongoose"); // Necesario para validar el formato del ID

const getUserById = async (req, res) => {
  // 1. Sanitización: Forzamos que sea String para romper el flujo de datos maliciosos
  const id = String(req.params.id); 
  const requestingUser = req.user;

  try {
    // 2. Validación de Formato: Evita que el motor de la DB procese basura o scripts
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Formato de identificador inválido" });
    }

    // 3. Lógica de Autorización (Protección Anti-IDOR)
    if (requestingUser.id !== id && requestingUser._userInfo.rango !== 'admin') {
      logger.warn(`Intento de IDOR detectado`, { 
          atacante: requestingUser.usuario, 
          victimaID: id 
      });
      return res.status(403).json({ error: "Acceso denegado" });
    }

    // 4. Consulta Segura: Usamos la variable 'id' ya validada y sanitizada
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    logger.safeError("Error obteniendo usuario", { error: err.message });
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

const updateUserById = async (req, res) => {
  // 1. Sanitización de entrada
  const id = String(req.params.id); 
  const requestingUser = req.user;
  const { correo, telefono } = req.body;

  try {
    // 2. Validación de Formato
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Formato de identificador inválido" });
    }

    // 3. Protección Anti-IDOR
    if (requestingUser.id !== id && requestingUser._userInfo.rango !== 'admin') {
      logger.warn(`Intento de IDOR en Update detectado`, { 
          atacante: requestingUser.usuario, 
          victimaID: id 
      });
      return res.status(403).json({ error: "Acceso denegado" });
    }

    // 4. Actualización Segura (Whitelisting de campos correo y telefono)
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