const fs = require('fs');
const crypto = require('crypto');

// === DATOS DEL NUEVO USUARIO ===
const nuevoUsuario = {
  usuario: 'Pepe',
  passwordPlano: 'clave123',
  rango: 'user' // o 'user', etc.
};

// === HASHEO DE CONTRASEÑA ===
const hashedPassword = crypto
  .createHmac('ripemd160', 'change_key_private_')
  .update(nuevoUsuario.passwordPlano)
  .digest('base64');

// === CARGA O CREA USERS.JSON ===
const ruta = './data/users.json';
let users = [];

if (fs.existsSync(ruta)) {
  users = JSON.parse(fs.readFileSync(ruta));
}

// === AGREGAR USUARIO NUEVO ===
users.push({
  usuario: nuevoUsuario.usuario,
  password: hashedPassword,
  _userInfo: {
    rango: nuevoUsuario.rango
  }
});

// === GUARDAR JSON ===
fs.writeFileSync(ruta, JSON.stringify(users, null, 2));
console.log(`Usuario '${nuevoUsuario.usuario}' registrado correctamente.`);
