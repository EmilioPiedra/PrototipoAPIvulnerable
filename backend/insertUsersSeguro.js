const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../.env" });

const UserSeguroSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  correo: { type: String, required: true },
  cedula: { type: String, required: true },
  telefono: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  _userInfo: {
    rango: { type: String, required: true },
    creditos: { type: Number, default: 0 },
  }
});

const UserSeguro = mongoose.model("usersSeguro", UserSeguroSchema);

const usersOld = [
  { usuario: "Emilio", correo: "emilio@gmail.com", cedula: "1102557832", telefono: "0991234567", password: "clave123", rango: "admin" },
  { usuario: "Pepe", correo: "pepe@gmail.com", cedula: "1102557833", telefono: "0991234567", password: "clave123", rango: "user" },
  { usuario: "Juan", correo: "Juan@gmail.com", cedula: "1102557834", telefono: "0991234567", password: "clave123", rango: "user" }
];

const insertarUsuarios = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    for (const user of usersOld) {
      const hashedPassword = await bcrypt.hash(user.password, 12); // bcrypt seguro
      await UserSeguro.create({
        usuario: user.usuario,
        correo: user.correo,
        cedula: user.cedula,
        telefono: user.telefono,
        password: hashedPassword,
        _userInfo: { rango: user.rango, creditos: 10 },
        createdAt: new Date()
      });
      console.log(`✅ Usuario ${user.usuario} insertado`);
    }

    console.log("✅ Todos los usuarios insertados en usersSeguro");
    process.exit();
  } catch (err) {
    console.error("❌ Error al insertar usuarios:", err);
    process.exit(1);
  }
};

insertarUsuarios();
