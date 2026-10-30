const {User} = require('../src/models');
const jwt = require('jsonwebtoken');
// Only for web
exports.signIN = async (req, res) => {
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
				res.status(400).json('wrong password');
			}
		} else {
			res.status(402).json('There is no any Account for this Email.');
		}
	} catch (error) {
		res.status(403).json(error.message);
	}
};

// Only for mobile app
exports.sendOTP = async (req, res) => {
	try {
		res.status(200).json(`OTP send to ${req.body.phone}`);
	} catch (error) {
		res.status(403).json(error.message);
	}
};
// Only for mobile app
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
// Only for Mobile app
exports.mobileSignUp = async (req, res) => {
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
	try {
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {user_id: req.user.user_id},
		});
		if (user) {
			await user.update({status: false, refresh_token: null});
			return res.status(200).json('logout success!');
		}
		res.status(404).json('user not found');
	} catch (error) {
		console.log('error while signout');
		res.status(402).json(error.message);
	}
};
