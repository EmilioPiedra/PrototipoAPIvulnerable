const otps = require("../utils/otp-store");
const User = require("../models/User");
const crypto = require("crypto");

// === Solicita OTP ===
const requestOTP = async (req, res) => {
  const { usuario } = req.body;

  const user = await User.findOne({ usuario });
  if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

  const otp = Math.floor(1000 + Math.random() * 9000);
  otps.set(usuario, otp);

  console.log(`OTP para ${usuario}: ${otp}`);
  res.json({ mensaje: "OTP generado y enviado" });
};

// === Verifica OTP ===
const verifyOTP = (req, res) => {
  const { usuario, otp } = req.body;
  const guardado = otps.get(usuario);

  if (!guardado || guardado != otp) {
    return res.status(400).json({ valido: false, mensaje: "OTP inválido" });
  }

  res.json({ valido: true, mensaje: "OTP válido" });
};

// === Cambiar contraseña ===
const changePassword = async (req, res) => {
  const { usuario, otp, nuevaPassword } = req.body;

  const user = await User.findOne({ usuario });
  if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

  const guardado = otps.get(usuario);
  if (!guardado || guardado != otp) {
    return res.status(400).json({ mensaje: "OTP inválido" });
  }

  const hashedPassword = crypto
    .createHmac("ripemd160", "change_key_private_")
    .update(nuevaPassword)
    .digest("base64");

  await User.updateOne({ usuario }, { password: hashedPassword });
  otps.delete(usuario);

  res.json({ mensaje: "Contraseña cambiada con éxito" });
};

module.exports = { requestOTP, verifyOTP, changePassword };
