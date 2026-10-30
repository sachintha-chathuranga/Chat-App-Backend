import { Request, Response } from "express";
import handleError from "../utils/errorHandler";

const {User} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Only for web
exports.signIN = async (req:Request, res:Response) => {
	try {
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token'],
			},
			where: {email: req.body.email},
		});
		if (user) {
			const validPassword = await bcrypt.compare(req.body.password, user.password);
			if (validPassword) {
				const obj = JSON.parse(JSON.stringify(user));
				delete obj.password;
				const accessToken = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, {
					expiresIn: '1min',
				});
				const refreshToken = jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
				await user.update({
					status: true,
					refresh_token: refreshToken,
				});
				res.cookie('jwt', refreshToken, {
					httpOnly: true,
					sameSite: 'none',
					secure: true,
					maxAge: 24 * 60 * 60 * 1000,
				});
				res.status(200).json({
					...obj,
					status: true,
					access_token: accessToken,
				});
			} else {
				res.status(400).json('Invalid Password or Email');
			}
		} else {
			res.status(402).json('Invalid Password or Email');
		}
	} catch (error) {
		res.status(500).json(handleError(error));
	}
};

// Only for mobile app
exports.sendOTP = async (req:Request, res:Response) => {
	try {
		res.status(200).json(`OTP send to ${req.body.phone}`);
	} catch (error) {
		res.status(500).json(handleError(error));
	}
};
// Only for mobile app
exports.verifyOTP = async (req:Request, res:Response) => {
	try {
		const userOTP = req.body.otp;
		if (userOTP === '125456') {
			let user = await User.findOne({
				attributes: {
					exclude: ['refresh_token'],
				},
				where: {phone: req.body.phone},
			});
			if (!user) {
				const newUser = await User.create({
					phone: req.body.phone,
				});
				return res.status(200).json({user: newUser});
			}
			const obj = JSON.parse(JSON.stringify(user));
			const accessToken = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '1min',
			});
			const refreshToken = jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
			await user.update({
				status: true,
				refresh_token: refreshToken,
			});
			res.status(200).json({user, accessToken, refreshToken});
		} else {
			res.status(402).json('Invalide OTP');
		}
	} catch (error) {
		res.status(500).json(handleError(error));
	}
};
// Only for Mobile app
exports.mobileSignUp = async (req:Request, res:Response) => {
	try {
		const [fname, lname] = req.body.userName.split(' ');
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {user_id: req.body.userId},
		});
		if (user) {
			await user.update({fname, lname});
			const obj = JSON.parse(JSON.stringify(user));
			const accessToken = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '1min',
			});
			const refreshToken = jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
			await user.update({
				status: true,
				refresh_token: refreshToken,
			});
			return res.status(200).json({user, accessToken, refreshToken});
		}
		res.status(400).json('User not found');
	} catch (error) {
		res.status(500).json(handleError(error));
	}
};

exports.signOut = async (req:Request, res:Response) => {
	try {
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {user_id: req.user?.user_id},
		});
		if (user) {
			await user.update({status: false, refresh_token: null});
			return res.status(200).json('logout success!');
		}
		res.status(404).json('user not found');
	} catch (error) {
		res.status(500).json(handleError(error));
	}
};
