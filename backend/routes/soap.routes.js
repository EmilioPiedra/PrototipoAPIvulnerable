const express = require("express");
const router = express.Router();
const { verificarAntecedentes } = require("../controllers/soap.controller");

router.post("/verificar-antecedentes", verificarAntecedentes);

module.exports = router;
