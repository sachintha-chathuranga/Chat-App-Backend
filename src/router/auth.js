const express = require('express');
const {signIn, sendOTP, verifyOTP, mobileSignUp, signOut, signIN} = require('../controllers/auth');
const { updateMobileAccessToken, updateAccessToken } = require('../controllers/refreshTokenController');
const verifyJWT = require('../middleware/verifyJwT');
const { mobileNameValidation, validation } = require('../middleware/validation');
const { createUser } = require('../controllers/users');
const clearCookie = require('../middleware/clearCookie');

const router = express.Router();

// Web route
router.route('/sign-up').post(validation, createUser);
router.route('/sign-in').post(signIN);
router.route('/update-token').put(updateAccessToken);
router.route('/sign-out').post(verifyJWT,clearCookie, signOut);

// Mobile routes
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/update-mobile-token').put(updateMobileAccessToken);
router.route('/mobile-sign-up').post(mobileNameValidation, mobileSignUp);
router.route('/mobile-sign-out').put(verifyJWT,signOut);
module.exports = router;
