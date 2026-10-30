import express from 'express';
import {mobileSignUp, sendOTP, signIN, signOut, verifyOTP} from '../controllers/auth';
import {updateAccessToken, updateMobileAccessToken} from '../controllers/refreshTokenController';
import {createUser} from '../controllers/users';
import clearCookie from '../middleware/clearCookie';
import {mobileNameValidation, validation} from '../middleware/validation';
import verifyJWT from '../middleware/verifyJwT';

const router = express.Router();

// Web route
router.route('/sign-up').post(validation, createUser);
router.route('/sign-in').post(signIN);
router.route('/update-token').put(updateAccessToken);
router.route('/sign-out').post(verifyJWT, clearCookie,signOut);

// Mobile routes
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/update-mobile-token').put(updateMobileAccessToken);
router.route('/mobile-sign-up').post(mobileNameValidation, mobileSignUp);
router.route('/mobile-sign-out').put(verifyJWT, signOut);

export default router;
