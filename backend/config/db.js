const mongoose = require("mongoose");
const logger = require("../utils/logger"); // Usamos el logger que creamos

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("MONGO_URI no está definida en el archivo .env");
    }

    // Conexión limpia (sin opciones deprecadas)
    const conn = await mongoose.connect(uri);

    logger.info(`MongoDB Conectado: ${conn.connection.host}`);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
    
  } catch (error) {
    logger.error("Error conectando a MongoDB", { error: error.message });
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;