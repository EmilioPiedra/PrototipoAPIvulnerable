const JWT = require("../jwt/jwt");
const User = require("../models/User"); // modelo de MongoDB

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: process.env.JWT_SECRET || "mi_llave_secreta" });

  if (!decoded) return res.status(401).json({ error: "Token inválido o expirado" });

  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: "Error leyendo usuarios", details: err.message });
  }
};

// Actualizar usuario por `usuario`
const actualizarUser = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: process.env.JWT_SECRET || "mi_llave_secreta" });

  if (!decoded) return res.status(401).json({ error: "Token inválido o expirado" });

  const { usuario } = req.params;
  const newData = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { usuario },
      { $set: newData },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    return res.json({ message: "Usuario actualizado", user });
  } catch (err) {
    return res.status(500).json({ error: "Error actualizando usuario", details: err.message });
  }
};

//  Eliminar usuario por `usuario`
const eliminarUser = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: process.env.JWT_SECRET || "mi_llave_secreta" });

  if (!decoded) return res.status(401).json({ error: "Token inválido o expirado" });

  const { usuario } = req.params;

  try {
    const result = await User.deleteOne({ usuario });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    return res.status(500).json({ error: "Error eliminando usuario", details: err.message });
  }
};

module.exports = { getUsers, actualizarUser, eliminarUser };
