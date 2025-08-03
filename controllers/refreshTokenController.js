const {User} = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.updateAccessToken = async (req, res) => {
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
