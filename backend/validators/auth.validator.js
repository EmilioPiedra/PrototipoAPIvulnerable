const { check } = require("express-validator");

exports.loginValidator = [
  check("usuario").notEmpty().isString(),
  check("password").notEmpty().isString(),
];
