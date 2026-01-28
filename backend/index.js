require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

// IMPORTAR SOLO EL LIMITADOR GLOBAL
const { apiLimiter } = require('./middlewares/rateLimit.middleware');

const app = express();

// --- CONFIGURACIÓN DE RED (Crucial para Rate Limit) ---
// Permite que Express confíe en los encabezados de proxies (como Render, Heroku o Nginx)
// para obtener la IP real del cliente y no la del servidor.
app.set('trust proxy', 1);
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
// 3. Parser JSON y HPP
app.use(express.json({ limit: '10kb' }));
app.use(hpp());
// 4. RATE LIMIT GLOBAL (100 peticiones)
// Se aplica a todas las rutas que empiecen con /api
app.use("/api", apiLimiter); 

// === DEFINICIÓN DE RUTAS ===
// Nota: Cada archivo de ruta debe manejar su propio authLimiter internamente

// Rutas de Autenticación y OTP
app.use("/api/auth", require("./routes/auth.routes")); 
app.use("/api/otp", require("./routes/otp.routes"));

// Rutas de Negocio (Inventario y Usuarios)
app.use("/api/inventario", require("./routes/inventario.routes"));
app.use("/api/user", require("./routes/user.routes"));

// Rutas de Administración
app.use("/api/admin", require("./routes/admin.routes")); 

// --- MANEJO DE ERRORES ---
app.use((req, res) => {
    logger.warn(`Ruta no encontrada (404): ${req.originalUrl}`, { ip: req.ip });
    res.status(404).json({ error: "Ruta no encontrada" });
});

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