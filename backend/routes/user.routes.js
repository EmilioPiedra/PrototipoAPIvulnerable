// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.js');
const { getUserById } = require('../controllers/user.controller');

router.get('/:id', authenticate, getUserById);

module.exports = router;
