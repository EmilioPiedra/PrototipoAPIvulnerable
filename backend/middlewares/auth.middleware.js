const { verifyToken } = require("../security/jwt");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const token = header.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) return res.status(401).json({ error: "Token inválido o expirado" });

  req.user = decoded;
  next();
};
