const axios = require("axios");
const JWT = require("../jwt/jwt");


const SOAP_URL = "http://localhost:8080/soap";

const verificarAntecedentes = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];
  const jwt = new JWT();
  const decoded = jwt.decode({ token, secret: "mi_llave_secreta" });

  if (!decoded) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  const { cedula } = req.body;
  if (!cedula) {
    return res.status(400).json({ error: "Falta el campo 'cedula'" });
  }

  const xml = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <cedula>${cedula}</cedula>
      </soap:Body>
    </soap:Envelope>
  `;

  try {
    const respuesta = await axios.post(SOAP_URL, xml, {
      headers: { "Content-Type": "text/xml" },
    });

    const match = respuesta.data.match(/<estado>(.*?)<\/estado>/);
    const estado = match ? match[1] : "Respuesta no válida";

    res.json({ estado });
  } catch (error) {
    console.error("❌ Error al consumir el servicio SOAP:", error.message);
    res.status(500).json({ error: "No se pudo verificar antecedentes" });
  }
};

module.exports = { verificarAntecedentes };
