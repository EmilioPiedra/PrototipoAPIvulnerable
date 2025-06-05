const express = require("express");
const cors = require("cors");
const app = express();

// CORS: permitir solo al frontend en localhost:3001
app.use(
  cors({
    origin: "http://localhost:3000", // o '*' para todos (solo en desarrollo)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Tus rutas
const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);
const obtenerRoutes = require("./routes/admin.routes");
app.use("/api", obtenerRoutes);
const otpRoutes = require("./routes/otp.routes");
app.use("/api", otpRoutes); // Accesibles en /api/request-otp y /api/verify-otp
const changePasswordRoutes = require("./routes/otp.routes");
app.use("/api", changePasswordRoutes); // Accesibles en /api/change-password
const inventarioRoutes = require("./routes/inventario.routes");
app.use("/api", inventarioRoutes); // Accesibles en /api/inventario
// Iniciar el servidor
app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
