const express = require('express');
const {signIn, sendOTP, verifyOTP, signUp, signOut} = require('../controllers/auth');
const { updateMobileAccessToken, updateAccessToken } = require('../controllers/refreshTokenController');
const verifyJWT = require('../middleware/verifyJwT');
const { mobileNameValidation, validation } = require('../middleware/validation');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/sign-up').post(validation, signUp);
router.route('/update-token').put(updateAccessToken);
router.route('/sign-out').put(verifyJWT,signOut);

router.route('/mobile/update-token').put(updateMobileAccessToken);
router.route('/mobile/sign-up').post(mobileNameValidation, signUp);
module.exports = router;
