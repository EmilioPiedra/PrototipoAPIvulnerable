const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP'); // Tu modelo de OTP
const crypto = require('crypto'); // Para generar el código
const logger = require('../utils/logger');

// === PASO 1: VALIDAR CREDENCIALES Y ENVIAR OTP ===
const loginStepOne = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  try {
    const sanitizedUsuario = String(req.body.usuario); 
    const user = await User.findOne({ usuario: sanitizedUsuario }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Rate limiter manejará los intentos fallidos
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // --- AQUÍ EMPIEZA LA MAGIA DEL 2FA ---

    // 1. Generar OTP de 6 dígitos
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // 2. Guardar en Mongo (Con TTL de 5 min)
    await OTP.findOneAndUpdate(
      { usuario: user.usuario }, 
      { otp: otpCode }, 
      { upsert: true, new: true }
    );

    // 3. Generar un "Pre-Auth Token" (Solo sirve para validar OTP)
    // No contiene rol, ni permisos. Solo el ID.
    const tempToken = jwt.sign(
      { sub: user._id, type: '2fa_pending' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '5m' } // Expira rápido
    );

    // 4. Log (y Simulación de envío de correo)
    logger.info(`2FA Iniciado`, { usuario: user.usuario });
    
    // EN PROD: Aquí enviarías el email.
    // PARA TESIS: Lo mostramos en consola o en la respuesta (solo para demo)
    console.log(`[2FA OTP] Para ${user.usuario}: ${otpCode}`);

    return res.json({
      message: "Credenciales correctas. Se ha enviado un código OTP.",
      require2FA: true,
      tempToken: tempToken // El front debe guardar esto para el paso 2
    });

  } catch (err) {
    logger.safeError('Error en Login Paso 1', { error: err.message });
    return res.status(500).json({ error: "Error interno" });
  }
};

// === PASO 2: VERIFICAR OTP Y DAR ACCESO ===
const loginStepTwo = async (req, res) => {
  const { tempToken, otp } = req.body;

  if (!tempToken || !otp) {
    return res.status(400).json({ error: "Faltan datos (token temporal o OTP)" });
  }

  try {
    // 1. Verificar que el token temporal sea válido
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    
    // Verificar que sea del tipo correcto (para que no usen un token viejo de acceso)
    if (decoded.type !== '2fa_pending') {
      return res.status(401).json({ error: "Token inválido para esta operación" });
    }

    // 2. Buscar al usuario
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    // 3. Verificar el OTP en base de datos
    const otpRecord = await OTP.findOne({ usuario: user.usuario });
    
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(401).json({ error: "Código OTP incorrecto o expirado" });
    }

    // --- ÉXITO TOTAL ---

    // 4. Borrar el OTP usado (Anti-Replay)
    await OTP.deleteOne({ usuario: user.usuario });

    // 5. Generar el Token de Acceso REAL (Con roles y permisos)
    const accessToken = jwt.sign(
      { 
        sub: user._id, 
        role: user._userInfo.rango 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    logger.info(`Login 2FA Completado Exitosamente`, { usuario: user.usuario });

    // Devolver usuario limpio
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({
      message: "Autenticación 2FA Exitosa",
      token: accessToken, // ESTE es el que sirve para las demás rutas
      user: userResponse
    });

  } catch (err) {
    logger.safeError('Error en Login Paso 2', { error: err.message });
    return res.status(401).json({ error: "Token temporal inválido o expirado" });
  }
};

const getUserToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json({ message: "Token válido", user });
  } catch (error) {
    logger.safeError("Error obteniendo perfil", { error: error.message });
    return res.status(500).json({ error: "Error al obtener perfil" });
  }
};

module.exports = { loginStepOne, loginStepTwo, getUserToken }; // Exporta las nuevas