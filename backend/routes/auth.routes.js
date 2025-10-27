// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { login, refresh, logout, getUserToken } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/protected', getUserToken);

module.exports = router;

