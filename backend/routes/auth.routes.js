// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const rateLimit = require("../middlewares/rateLimit.middleware");
const { login } = require("../controllers/auth.controller");
const { loginValidator } = require("../validators/Auth.validator");

router.post("/login", rateLimit, loginValidator, login);

module.exports = router;
