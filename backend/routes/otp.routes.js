// routes/otp.routes.js
const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP, changePassword } = require('../controllers/otp.controller');

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/change-password', changePassword);
module.exports = router;