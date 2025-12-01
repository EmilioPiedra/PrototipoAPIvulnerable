const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const logger = require("../utils/logger");

// 1. SOLICITAR OTP (Público)
const requestOTP = async (req, res) => {
  const { usuario } = req.body;

  try {
    const user = await User.findOne({ usuario });
    if (!user) {
      // OWASP: No reveles si el usuario existe o no. Responde siempre igual.
      // Pero para tu tesis, puedes dejar el 404 si prefieres claridad en la demo.
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // MEJORA OWASP: Generar 6 dígitos en lugar de 4
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Guardar en BD (Reemplaza si ya existe uno anterior)
    await OTP.findOneAndUpdate(
      { usuario }, 
      { otp: otpCode }, 
      { upsert: true, new: true }
    );

    // Simulamos envío de correo
    logger.info(`OTP generado para ${usuario}`);
    console.log(`[SECURE OTP] Para ${usuario}: ${otpCode}`);

    res.json({ message: "OTP enviado. Expira en 5 minutos." });
  } catch (err) {
    logger.safeError("Error generando OTP", { error: err.message });
    res.status(500).json({ error: "Error interno" });
  }
};

// 2. VERIFICAR OTP (Público - Paso intermedio)
const verifyOTP = async (req, res) => {
  const { usuario, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ usuario });
    
    // Validación estricta
    if (!otpRecord || otpRecord.otp !== otp) {
      // Rate Limit ya protegió esto en la ruta
      return res.status(400).json({ valido: false, message: "Código incorrecto o expirado" });
    }

    res.json({ valido: true, message: "Código correcto. Puede proceder a cambiar contraseña." });
  } catch (err) {
    logger.safeError("Error verificando OTP", { error: err.message });
    res.status(500).json({ error: "Error interno" });
  }
};

// 3. CAMBIAR CONTRASEÑA (Público, pero requiere OTP válido)
const changePassword = async (req, res) => {
  const { usuario, otp, nuevaPassword } = req.body;

  try {
    // 1. Doble check del OTP (Evita que alguien salte el paso de verify)
    const otpRecord = await OTP.findOne({ usuario });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Código incorrecto o expirado" });
    }

    // 2. Validar complejidad de contraseña (NIST: Mínimo 8 caracteres)
    if (nuevaPassword.length < 8) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
    }

    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // 3. Hashear y Guardar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(nuevaPassword, salt);
    await user.save();

    // 4. ANTI-REPLAY: Borrar el OTP usado inmediatamente
    await OTP.deleteOne({ usuario });

    logger.info(`Contraseña cambiada exitosamente`, { usuario });
    res.json({ message: "Contraseña actualizada. Inicie sesión con su nueva clave." });

  } catch (err) {
    logger.safeError("Error cambiando contraseña", { error: err.message });
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = { requestOTP, verifyOTP, changePassword };