const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const Inventario = require("../backend/models/Inventario");
const User = require("../backend/models/User");

const conectar = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // === HASHEO ===
    const clavePlano = "clave123";
    const passwordHasheado = crypto
      .createHmac("ripemd160", "change_key_private_")
      .update(clavePlano)
      .digest("base64");

    // === Datos de usuarios ===
    const usersData = [
      {
        usuario: "Pedro",
        correo: "pedro@gmail.com",
        telefono: "0991234567",
        password: passwordHasheado,
        createdAt: new Date(),
        _userInfo: {
          rango: "user",
          creditos: 10
        }
      }
    ];

    // === Datos de inventario ===
    const inventarioData = [
      {
        nombre: "Herbicida Total",
        categoria: "Agrícola",
        cantidad: 18,
        estado: "Bueno",
        descripcion: "Herbicida sistémico para control de maleza en terrenos agrícolas antes de la siembra.",
        ubicacion: "Estantería B3",
      }
    ];

    // === Inserción ===
    await Inventario.insertMany(inventarioData);
    console.log("✅ Inventario insertado");

    await User.insertMany(usersData);
    console.log("✅ Usuario insertado con password hasheada");

    process.exit();
  } catch (error) {
    console.error("❌ Error al insertar:", error.message);
    process.exit(1);
  }
};

conectar();
