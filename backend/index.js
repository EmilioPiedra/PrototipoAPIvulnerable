require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Seguridad Headers
const hpp = require("hpp");       // Polución de parámetros
const connectDB = require("./config/db");
const logger = require("./utils/logger"); // ¡IMPORTANTE! Importar tu logger

// IMPORTAR LOS LIMITADORES
const { apiLimiter } = require('./middlewares/rateLimit.middleware');



const app = express();

// 1. SEGURIDAD: Helmet
app.use(helmet());

// 2. SEGURIDAD: CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// 3. Parser JSON
app.use(express.json({ limit: '10kb' }));

// 4. SEGURIDAD: HPP
app.use(hpp());

// 5. SEGURIDAD: RATE LIMIT GLOBAL (Aquí estaba el faltante)
// Aplicamos el límite de 100 peticiones a TODAS las rutas que empiecen por /api
app.use("/api", apiLimiter); 

// === RUTAS ===

// 1. PUBLICAS (Deben ir primero para que no las bloqueen los middlewares de otras)
app.use("/api", require("./routes/auth.routes")); // Login es público
app.use("/api", require("./routes/otp.routes"));  // OTP es público <--- ¡AQUÍ!

// 2. MIXTAS (Tienen protecciones internas específicas)
app.use("/api", require("./routes/inventario.routes"));
app.use("/api/user", require("./routes/user.routes"));

// 3. PROTEGIDAS GLOBALES (Como Admin aplica 'protect' a todo, va al final)
app.use("/api", require("./routes/admin.routes")); 

// ... manejo de 404 ...

// Manejo de 404
app.use((req, res, next) => {
    logger.warn(`Ruta no encontrada (404): ${req.originalUrl}`, { ip: req.ip });
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo Global de Errores
app.use((err, req, res, next) => {
  logger.safeError("Error No Controlado", {
      path: req.path,
      method: req.method,
      error: err.message
  });
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Servidor SEGURO corriendo en puerto ${PORT}`);
});