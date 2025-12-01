const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP, changePassword } = require('../controllers/otp.controller');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

// Aplicar Rate Limit estricto a todo el flujo de OTP
router.use(authLimiter);

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/change-password', changePassword);

module.exports = router;