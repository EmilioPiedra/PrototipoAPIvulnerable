const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config({ path: "../.env" });

const Inventario = require("../backend/models/Inventario");
const User = require("../backend/models/User");
const Antecedente = require("../backend/models/Antecedente");

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
        usuario: "Emilio",
        correo: "emilio@gmail.com",
        cedula: "1102557832",
        telefono: "0991234567",
        password: passwordHasheado,
        createdAt: new Date(),
        _userInfo: {
          rango: "admin",
          creditos: 10
        }
      },
      {
        usuario: "Pepe",
        correo: "pepe@gmail.com",
        cedula: "1102557833",
        telefono: "0991234567",
        password: passwordHasheado,
        createdAt: new Date(),
        _userInfo: {
          rango: "user",
          creditos: 10
        }
      },
      {
        usuario: "Juan",
        correo: "Juan@gmail.com",
        cedula: "1102557834",
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
      },
      {
        nombre: "Fungicida Protector",
        categoria: "Agrícola",
        cantidad: 25,
        estado: "Bueno",
        descripcion: "Fungicida preventivo para cultivos de tomate y pimiento.",
        ubicacion: "Estantería A1",
      },
      {
        nombre: "Insecticida Biológico",
        categoria: "Agrícola",
        cantidad: 30,
        estado: "Bueno",
        descripcion: "Insecticida a base de Bacillus thuringiensis para control de orugas en cultivos de maíz.",
        ubicacion: "Estantería C2",
      },
      {
        nombre: "Fertilizante Orgánico",
        categoria: "Agrícola",
        cantidad: 50,
        estado: "Bueno",
        descripcion: "Fertilizante orgánico a base de compost para mejorar la fertilidad del suelo.",
        ubicacion: "Estantería D4",
      },
      {
        nombre: "Semillas de Maíz",
        categoria: "Agrícola",
        cantidad: 100,
        estado: "Bueno",
        descripcion: "Semillas híbridas de maíz de alta productividad.",
        ubicacion: "Estantería E5",
      },
      {
        nombre: "Semillas de Tomate",
        categoria: "Agrícola",
        cantidad: 80,
        estado: "Bueno",
        descripcion: "Semillas de tomate resistente a enfermedades comunes.",
        ubicacion: "Estantería F6",
      },
      {
        nombre: "Equipo de Riego por Goteo",
        categoria: "Equipamiento",
        cantidad: 5,
        estado: "Bueno",
        descripcion: "Sistema de riego por goteo para optimizar el uso del agua en cultivos.",
        ubicacion: "Estantería G7",
      },
      {
        nombre: "Guantes de Protección",
        categoria: "Seguridad",
        cantidad: 50,
        estado: "Bueno",
        descripcion: "Guantes resistentes a productos químicos para manipulación segura.",
        ubicacion: "Estantería H8",
      },
      {
        nombre: "Botas de Seguridad",
        categoria: "Seguridad",
        cantidad: 20,
        estado: "Bueno",
        descripcion: "Botas impermeables y antideslizantes para trabajo en campo.",
        ubicacion: "Estantería I9",
      },
      {
        nombre: "Máscaras Respiratorias",
        categoria: "Seguridad",
        cantidad: 30,
        estado: "Bueno",
        descripcion: "Máscaras desechables para protección contra polvo y productos químicos.",
        ubicacion: "Estantería J10", 
      }
    ];

    // === Datos de antecedentes ===
    const antecedentesData = [
      { cedula: "1102557833", estado: "Tiene antecedentes" },
      { cedula: "1102557834", estado: "Sin antecedentes" }
    ];

    await User.insertMany(usersData);
    console.log("✅ Usuarios insertados");

    await Inventario.insertMany(inventarioData);
    console.log("✅ Inventario insertado");

    await Antecedente.insertMany(antecedentesData);
    console.log("✅ Antecedentes insertados");

    process.exit();
  } catch (error) {
    console.error("❌ Error al insertar:", error.message);
    process.exit(1);
  }
};

conectar();
