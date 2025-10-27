const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: "../.env" });

const app = express();

// === Seguridad básica ===
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // o '*' solo en desarrollo
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// === Rate limit para proteger login ===
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 peticiones por minuto por IP
  message: { error: "Demasiadas peticiones, inténtelo más tarde" },
});
app.use("/api/login", limiter);

// === Tus rutas ===
const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const obtenerRoutes = require("./routes/admin.routes");
app.use("/api", obtenerRoutes);

const otpRoutes = require("./routes/otp.routes");
app.use("/api", otpRoutes); // /api/request-otp, /api/verify-otp

const changePasswordRoutes = require("./routes/otp.routes");
app.use("/api", changePasswordRoutes); // /api/change-password

const inventarioRoutes = require("./routes/inventario.routes");
app.use("/api", inventarioRoutes); // /api/inventario

app.use("/api", require("./routes/soap.routes"));

const facturaRoutes = require("./routes/factura.routes");
app.use("/api", facturaRoutes); // /api/factura

const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);

// === Conexión a la base de datos ===
const connectDB = require("./config/db");
connectDB();

// === Iniciar servidor ===
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
