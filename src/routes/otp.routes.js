const express = require('express');
const router = express.Router();
const { OTP_CONTROLLER } = require('../controllers');

router.post('/send-otp', OTP_CONTROLLER.sendOtp);
router.post('/verify-otp', OTP_CONTROLLER.verifyOtp);

module.exports = router;
