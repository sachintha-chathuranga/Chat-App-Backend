const {User} = require('../models');
const jwt = require('jsonwebtoken');

// Only for web app
exports.updateAccessToken = async (req, res) => {
	console.log("Update AccessToken")
	console.log(process.env.REFRESH_TOKEN_SECRET);
	const cookies = req.cookies;
	try {
		if (!cookies.jwt) return res.status(401).json('JWT not in cookies');
		const refreshToken = cookies.jwt;
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {refresh_token: refreshToken},
		});
		if (!user) return res.status(402).json('user not found');
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
			if (err || user.dataValues.user_id !== decoded.user_id) {
				user.update({status: false, refresh_token: null});
				res.clearCookie('jwt', {httpOnly: true, samesite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
				return res.status(403).json('unautherize');
			}
			const accessToken = jwt.sign(user.dataValues, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1min'});
			res.status(200).json({...user.dataValues, access_token: accessToken});
		});
	} catch (error) {
		res.status(402).json(error.message);
	}
};
// Only for Mobile app
exports.updateMobileAccessToken = async (req, res) => {
	try {
		const refreshToken = req.body.refreshToken;
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {refresh_token: refreshToken},
		});
		if (!user) return res.status(402).json('Unautherize(refresh token not in DB)');
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
			if (err || user.dataValues.user_id !== decoded.user_id) {
				console.log('token verification failed!');
				user.update({status: false, refresh_token: null});
				return res.status(402).json('Unautherize(refresh token is expire)');
			}
			const accessToken = jwt.sign(user.dataValues, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1min'});
			res.status(200).json({...user.dataValues, access_token: accessToken});
		});
	} catch (error) {
		console.log(error);
		res.status(402).json(error.message);
	}
};
