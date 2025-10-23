// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { login, getUserToken} = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/protected', getUserToken);
module.exports = router;