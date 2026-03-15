const {User} = require('../models/User');

exports.sendOTP = async (req, res) => {
	try {
		res.status(200).json({message: `OTP send to ${req.body.phone}`});
	} catch (error) {
		console.log(error);
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
				user = newUser;
				console.log("new user created")
			}
			res.status(200).json({user});
		} else {
			res.status(402).json({message: 'Invalide OTP'});
		}
	} catch (error) {
		console.log(error);
		res.status(403).json(error.message);
	}
};

exports.signUp = async (req, res) => {
	try {
		const [fname, lname] = req.body.userName.split(' ');
		console.log(req.body.userName)
		console.log("first : "+fname)
		console.log("last : "+lname)
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {user_id: req.body.userId},
		});
		if (user) {
			await user.update({fname, lname});
			console.log("user update success")
		}
		
		res.status(200).json({user});
	} catch (error) {
		console.log(error);
		res.status(403).json(error.message);
	}
};
