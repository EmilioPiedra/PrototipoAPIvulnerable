const otps = require('../utils/otp-store');
const usuarios = require('../data/users');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const getUserByUsername = (nombre) => usuarios.find(u => u.usuario === nombre);

const requestOTP = (req, res) => {
  const { usuario } = req.body;
  const user = getUserByUsername(usuario);
  if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const otp = Math.floor(1000 + Math.random() * 9000);
  otps.set(usuario, otp);

  console.log(`OTP para ${usuario}: ${otp}`);
  res.json({ mensaje: 'OTP generado y enviado' });
};

const verifyOTP = (req, res) => {
  const { usuario, otp } = req.body;
  const guardado = otps.get(usuario);

  if (!guardado || guardado != otp) {
    return res.status(400).json({ valido: false, mensaje: 'OTP inválido' });
  }

  res.json({ valido: true, mensaje: 'OTP válido' });
};



const changePassword = (req, res) => {
  const { usuario, otp, nuevaPassword } = req.body;

  const user = getUserByUsername(usuario);
  if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const guardado = otps.get(usuario);
  if (!guardado || guardado != otp) {
    return res.status(400).json({ mensaje: 'OTP inválido' });
  }

  const hashedPassword = crypto
    .createHmac('ripemd160', 'change_key_private_')
    .update(nuevaPassword)
    .digest('base64');

  user.password = hashedPassword;
  otps.delete(usuario);

  const rutaUsuarios = path.join(__dirname, '../data/users.json');
  fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 2));

  res.json({ mensaje: 'Contraseña cambiada con éxito' });
};

module.exports = { requestOTP, verifyOTP, changePassword };
