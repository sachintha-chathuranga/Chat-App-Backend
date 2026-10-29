const {User} = require('../models');
const jwt = require('jsonwebtoken');

exports.sendOTP = async (req, res) => {
	try {
		res.status(200).json(`OTP send to ${req.body.phone}`);
	} catch (error) {
		res.status(403).json(error.message);
	}
};
exports.verifyOTP = async (req, res) => {
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
		console.log(error);
		res.status(403).json(error.message);
	}
};

exports.signUp = async (req, res) => {
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
		console.log(error);
		res.status(403).json(error.message);
	}
};

exports.signOut = async (req, res) => {
	console.log('sign out call');
	try {
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {user_id: req.user.user_id},
		});
		if (user) {
			console.log('user found');
			await user.update({status: false, refresh_token: null});
			return res.status(200).json('logout success!');
		}
		console.log('user not found');
		res.status(404).json('user not found');
	} catch (error) {
		console.log('error while signou');
		res.status(402).json(error.message);
	}
};
