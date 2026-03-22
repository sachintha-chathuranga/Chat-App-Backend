const express = require('express');
const {signIn, sendOTP, verifyOTP, signUp, signOut} = require('../controllers/auth');
const { updateMobileAccessToken } = require('../controllers/refreshTokenController');
const verifyJWT = require('../middleware/verifyJwT');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/sign-up').post(signUp);
router.route('/update-token').put(updateMobileAccessToken);
router.route('/sign-out').put(verifyJWT,signOut);
module.exports = router;
