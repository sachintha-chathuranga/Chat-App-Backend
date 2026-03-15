const express = require('express');
const {signIn, sendOTP, verifyOTP, signUp} = require('../controllers/auth');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/sign-up').post(signUp);

module.exports = router;
