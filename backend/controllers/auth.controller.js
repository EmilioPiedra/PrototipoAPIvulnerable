const crypto = require("crypto");
const JWT = require("../jwt/jwt");
const User = require("../models/User"); 

const login = async (req, res) => {
  // 1. Recibimos los datos. En un ataque, 'password' puede ser un objeto JSON.
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Faltan campos: usuario o password" });
  }

  try {
    let passwordParaBuscar = password;

    if (typeof password === 'string') {
        passwordParaBuscar = crypto
          .createHmac("ripemd160", "change_key_private_") 
          .update(password)
          .digest("base64");
    }

    const user = await User.findOne({ 
        usuario: usuario, 
        password: passwordParaBuscar 
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrecto" });
    }

    // Generamos el UUID y el Token (Tu lógica original)
    const uuid = crypto.randomBytes(20).toString("hex");
    const jwt = new JWT();

    const token = jwt
      .create({
        header: { alg: "HS256", typ: "JWT" },
        payload: {
          UUID: uuid,
          permiso: user._userInfo.rango
        },
        secret: process.env.JWT_SECRET || "mi_llave_secreta"
      })
      .get();

    return res.json({
      token,
      user: {
        _id: user._id,
        usuario: user.usuario,
        email: user.email,
        createdAt: user.createdAt,
        _userInfo: { rango: user._userInfo.rango }
      }
    });

  } catch (err) {
    console.error(err); // Útil para ver errores en la consola de Linux
    return res.status(500).json({ error: "Error al procesar el login", details: err.message });
  }
};

const getUserToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: process.env.JWT_SECRET || "mi_llave_secreta" });

  if (!decoded) return res.status(401).json({ error: "Token inválido o expirado" });

  return res.json({ message: "Acceso autorizado", user: decoded.payload });
};

module.exports = { login, getUserToken };