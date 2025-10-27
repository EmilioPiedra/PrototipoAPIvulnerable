const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  // Guardamos hash bcrypt; select:false evita devolverlo por defecto
  password: { type: String, required: true, select: false },

  // Si tienes datos legados, puedes marcar cómo se guardó la contraseña
  // ejemplo: 'legacy' | 'bcrypt'
  passwordAlgo: { type: String, enum: ['legacy','bcrypt'], default: 'bcrypt' },

  _userInfo: {
    rango: { type: String, enum: ['user','admin'], default: 'user' },
    creditos: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Re-hash sólo si password fue modificado
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // si ya no es legacy, aplicamos bcrypt
  if (this.passwordAlgo === 'legacy') {
    // no re-hash aquí; legacy será migrado en el login
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordAlgo = 'bcrypt';
  next();
});

// comparar contraseña con soportes para hash legacy (tu RIPEMD/HMAC)
userSchema.methods.verifyPassword = async function(plain) {
  // si stored es bcrypt
  if (this.passwordAlgo === 'bcrypt') {
    return bcrypt.compare(plain, this.password);
  }

  // fallback: verificar con tu HMAC RIPEMD-160 legacy
  // tu código original: crypto.createHmac("ripemd160", "change_key_private_").update(password).digest("base64");
  if (this.passwordAlgo === 'legacy') {
    try {
      const legacyHash = crypto
        .createHmac('ripemd160', 'change_key_private_')
        .update(plain)
        .digest('base64');

      // timingSafeEqual para prevenir timing attacks
      const a = Buffer.from(legacyHash, 'base64');
      const b = Buffer.from(this.password, 'base64');
      if (a.length !== b.length) return false;
      const ok = crypto.timingSafeEqual(a, b);
      return ok;
    } catch (e) {
      return false;
    }
  }

  // por defecto fallo
  return false;
};

// después de login exitoso con legacy, re-hash con bcrypt
userSchema.methods.migratePasswordToBcrypt = async function(plain) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(plain, salt);
  this.passwordAlgo = 'bcrypt';
  await this.save();
};

userSchema.methods.toSafeJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('usersSeguro', userSchema);
