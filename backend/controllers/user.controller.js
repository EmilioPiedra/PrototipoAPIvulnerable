const JWT = require("../jwt/jwt");
const User = require("../models/User"); 

const getUserById = async (req, res) => {
  try {
    // 1) Extraer token si existe (si no, negar)
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token inválido" });

    // 2) Decodificar token con tu JWT actual (no se verifica ownership)
    const jwt = new JWT();
    const decoded = jwt.decode({ token, secret: process.env.JWT_SECRET || "mi_llave_secreta" });
    if (!decoded) return res.status(401).json({ error: "Token inválido o expirado" });

    // 3) Omitimos cualquier verificación de que decoded.sub === req.params.id (esta es la vulnerabilidad)
    const id = req.params.id;

    // 4) Buscar usuario por id y devolver todos los datos (menos password)
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Devolvemos información completa: (ejemplo)
    return res.json({
      _id: user._id,
      usuario: user.usuario,
      correo: user.correo,
      cedula: user.cedula,
      telefono: user.telefono,
      createdAt: user.createdAt,
      _userInfo: user._userInfo,
      // cualquier otro campo que tengas en el documento
    });
  } catch (err) {
    return res.status(500).json({ error: "Error al obtener usuario", details: err.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });

    const token = authHeader.split(" ")[1];
    const jwt = new JWT();
    const decoded = jwt.decode({
      token,
      secret: process.env.JWT_SECRET || "mi_llave_secreta",
    });
    if (!decoded) return res.status(401).json({ error: "Token inválido o expirado" });

    const id = req.params.id;
    const { usuario, correo, cedula, telefono, _userInfo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { usuario, correo, cedula, telefono, _userInfo },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario", details: err.message });
  }
};

module.exports = { getUserById, updateUserById };