
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// IMPORTANTE: Asegúrate de que la ruta apunte a tu archivo User.js
// Aunque el archivo se llame User.js, dentro exporta el modelo "UserSeguro"
const UserSeguro = require("./models/User"); 

const seedUsers = async () => {
  try {
    // 1. Conectar a la BD
    if (!process.env.MONGO_URI) {
        throw new Error("Falta MONGO_URI en .env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB (Colección Segura)...");

    // 2. Limpiar usuarios viejos de la colección 'usersSeguro'
    await UserSeguro.deleteMany({});
    console.log("🗑️ Colección 'usersSeguro' limpiada.");

    // 3. Generar Hash seguro (Pass: 123456)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("123456", salt);

    // 4. Crear Usuarios

    // --- ADMIN ---
    await UserSeguro.create({
      usuario: "admin",
      correo: "admin@test.com",
      password: passwordHash,
      telefono: "0999999999",
      cedula: "1100000000",
      _userInfo: {
        rango: "admin",
        creditos: 1000
      }
    });
    console.log("👤 Admin creado: usuario='admin' pass='123456'");

    // --- USER A (Víctima) ---
    const userA = await UserSeguro.create({
      usuario: "userA",
      correo: "usera@test.com",
      password: passwordHash,
      telefono: "0988888888",
      cedula: "1100000001",
      _userInfo: {
        rango: "user",
        creditos: 10
      }
    });
    console.log(`👤 User A creado (ID: ${userA._id})`);

    // --- USER B (Atacante) ---
    const userB = await UserSeguro.create({
      usuario: "userB",
      correo: "userb@test.com",
      password: passwordHash,
      telefono: "0977777777",
      cedula: "1100000002",
      _userInfo: {
        rango: "user",
        creditos: 20
      }
    });
    console.log(`👤 User B creado (ID: ${userB._id})`);

    console.log("\n✅ ¡Datos de prueba insertados en usersSeguro!");
    process.exit();

  } catch (error) {
    console.error("❌ Error en el seeding:", error);
    process.exit(1);
  }
};

seedUsers();