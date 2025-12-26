require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
// Asegúrate de que la ruta sea correcta hacia tu archivo de modelo
const Inventario = require("./models/Inventario"); 

const seedInventario = async () => {
  try {
    // 1. Conexión
    if (!process.env.MONGO_URI) {
        throw new Error("Falta MONGO_URI en .env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB...");

    // 2. Limpieza
    await Inventario.deleteMany({});
    console.log("🗑️ Inventario limpiado.");

    // 3. Datos corregidos (Usando: disponible, agotado, descontinuado)
    const productos = [
      {
        nombre: "Laptop Dell Latitude 5420",
        categoria: "Electrónica",
        cantidad: 15,
        precio: 1200.00,
        estado: "disponible", // <--- CORREGIDO
        descripcion: "Laptop i7 16GB RAM",
        ubicacion: "Bodega A"
      },
      {
        nombre: "Monitor Samsung 24",
        categoria: "Periféricos",
        cantidad: 0,
        precio: 150.50,
        estado: "agotado",    // <--- CORREGIDO (Lógica: cantidad 0 = agotado)
        descripcion: "Monitor LED",
        ubicacion: "Bodega B"
      },
      {
        nombre: "Silla Ergonómica",
        categoria: "Mobiliario",
        cantidad: 5,
        precio: 350.00,
        estado: "disponible", // <--- CORREGIDO
        descripcion: "Silla oficina negra",
        ubicacion: "Gerencia"
      },
      {
        nombre: "Teclado Mecánico",
        categoria: "Periféricos",
        cantidad: 50,
        precio: 80.00,
        estado: "disponible", // <--- CORREGIDO
        descripcion: "Teclado RGB",
        ubicacion: "Bodega C"
      },
      {
        nombre: "Servidor Viejo HP",
        categoria: "Infraestructura",
        cantidad: 2,
        precio: 500.00,
        estado: "descontinuado", // <--- CORREGIDO (Para ítems viejos o dañados)
        descripcion: "Para repuestos",
        ubicacion: "Sótano"
      }
    ];

    // 4. Insertar
    await Inventario.insertMany(productos);
    console.log(`✅ ¡Éxito! Se insertaron ${productos.length} productos válidos.`);
    process.exit();

  } catch (error) {
    console.error("❌ Error insertando datos:", error.message);
    process.exit(1);
  }
};

seedInventario();