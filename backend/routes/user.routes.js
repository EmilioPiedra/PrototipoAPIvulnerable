const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/auth.controller");

// NO usamos verifyToken que compruebe ownership — solo dejamos pasar cuando exista un JWT válido
router.get("/:id", getUserById);

module.exports = router;
