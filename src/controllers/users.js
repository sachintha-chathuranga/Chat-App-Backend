const snakeKeys = require('snakecase-keys');
const {User} = require('../models');
const bcrypt = require('bcrypt');
const {db} = require('../config/db');

// --create User, Only for web app
exports.createUser = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPass = await bcrypt.hash(req.body.password, salt);
		const newUser = await User.create({
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email,
			password: hashPass,
		});
		!newUser ? res.status(400).json('user not created') : res.status(200).json(null);
	} catch (error) {
		let errors = [];

		switch (error.name) {
			case 'SequelizeValidationError':
				error.errors.map((e) => {
					switch (e.message) {
						case 'Validation isAlpha on fname failed':
							errors.push('Please enter only alphabetic characters in first name field!');
							break;
						case 'Validation isAlpha on lname failed':
							errors.push('Please enter only alphabetic characters in last name field!');
							break;
						case 'Validation isEmail on email failed':
							errors.push('Invalid type of Email Address!');
							break;
					}
				});
				return res.status(401).json(errors[0]);
			case 'SequelizeUniqueConstraintError':
				return res.status(402).json('Email Alredy Exist. Try Another One!');
		}
		res.status(403).json(error.message);
	}
};

// --update user,
exports.updateUser = async (req, res) => {
	try {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}
		const user = await User.findOne({
			attributes: {
				exclude: ['refresh_token', 'password'],
			},
			where: {user_id: req.user.user_id},
		});
		const state = await user.update({...snakeKeys(req.body)});
		!state
			? res.status(400).json('user not update')
			: res.status(200).json({
					...user.dataValues,
					access_token: req.headers['authorization'].split(' ')[1],
			  });
	} catch (error) {
		let errors = [];

		switch (error.name) {
			case 'SequelizeValidationError':
				error.errors.map((e) => {
					switch (e.message) {
						case 'Validation isAlpha on fname failed':
							errors.push('Please enter only alphabetic characters in first name field!');
							break;
						case 'Validation isAlpha on lname failed':
							errors.push('Please enter only alphabetic characters in last name field!');
							break;
						case 'Validation isEmail on email failed':
							errors.push('Invalid type of Email Address!');
							break;
					}
				});
				return res.status(401).json(errors[0]);
			case 'SequelizeUniqueConstraintError':
				return res.status(402).json('Email Alredy Exist. Try Another One!');
		}
		res.status(403).json(error.message);
	}
};

// get a user by id or params
exports.getUser = async (req, res) => {
	try {
		const user = await User.findOne({
			attributes: {
				exclude: ['password', 'email', 'refresh_token'],
			},
			where: {user_id: req.params.id},
		});
		!user ? res.status(404).json('User Not Found') : res.status(200).json(user);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

//  get all
exports.getFriends = async (req, res) => {
	const limit = 15;
	const offset = req.query.index ? limit * (parseInt(req.query.index) - 1) : 0;

	try {
		const friends = await db.query(
			`
			SELECT 
				u.user_id,
				u.fname,
				u.lname,
				u.phone,
				u.profil_pic,
				u.status
			FROM users u
			WHERE u.user_id != :userId LIMIT :limit OFFSET :offset;`,
			{
				replacements: {
					userId: req.user.user_id,
					limit,
					offset,
				},
				type: db.QueryTypes.SELECT,
			}
		);

		res.status(200).json(friends);
	} catch (error) {
		res.status(500).json(error);
	}
};

// get all recent chating friends
exports.getRecentFriends = async (req, res) => {
	const limit = 15;
	const offset = req.query.index ? limit * (parseInt(req.query.index) - 1) : 0;

	try {
		const friends = await db.query(
			`
			SELECT 
				u.user_id,
				u.fname,
				u.lname,
				u.profil_pic,
				u.status,
				m.message AS lastMessage,
				m.createdAt AS lastMessageTime,
				m.sender_id,
				m.receiver_id
			FROM users u
			JOIN (
				SELECT m1.*
				FROM messages m1
				JOIN (
					SELECT 
					CASE
						WHEN sender_id = :userId THEN receiver_id
						ELSE sender_id
						END AS chatUserId,
					MAX(createdAt) AS maxCreatedAt
      			FROM messages
      			WHERE sender_id = :userId OR receiver_id = :userId
     			 	GROUP BY chatUserId
    			) AS recentChats
      	ON (((m1.sender_id = :userId AND m1.receiver_id = recentChats.chatUserId) OR
         (m1.receiver_id = :userId AND m1.sender_id = recentChats.chatUserId)) AND 
			m1.createdAt = recentChats.maxCreatedAt)) m
    		ON u.user_id = CASE
							WHEN m.sender_id = :userId THEN m.receiver_id
							ELSE m.sender_id
    					END
			WHERE u.user_id != :userId ORDER BY m.createdAt DESC LIMIT :limit OFFSET :offset;`,
			{
				replacements: {
					userId: req.user.user_id,
					limit,
					offset,
				},
				type: db.QueryTypes.SELECT,
			}
		);

		res.status(200).json(friends);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.searhFriends = async (req, res) => {
	const requestedUserId = req.user.user_id;
	const search = req.body.name;
	const limit = 15;
	const offset = req.query.index ? limit * (parseInt(req.query.index) - 1) : 0;
	try {
		const friends = await db.query(
			`
			SELECT u.user_id,u.fname,u.lname,u.profil_pic,u.status,m.message AS lastMessage,m.createdAt AS lastMessageTime 
			FROM users u 
			LEFT JOIN (
				SELECT m1.* 
				FROM messages m1 
				JOIN (
					SELECT 
						CASE 
							WHEN sender_id = :userId THEN receiver_id 
							ELSE sender_id 
						END AS chatUserId, 
						MAX(createdAt) AS maxCreatedAt 
					FROM messages 
     				WHERE sender_id = :userId OR receiver_id = :userId 
					GROUP BY chatUserId
				) AS recentChats 
				ON (
					((m1.sender_id = :userId AND m1.receiver_id = recentChats.chatUserId) OR (m1.receiver_id = :userId AND m1.sender_id = recentChats.chatUserId)) AND m1.createdAt = recentChats.maxCreatedAt
				)
			) AS m 
			ON (
    			(m.sender_id = :userId AND u.user_id = m.receiver_id) OR
    			(m.receiver_id = :userId AND u.user_id = m.sender_id)
  			)
			WHERE u.user_id != :userId AND (u.fname LIKE :search OR u.lname LIKE :search) LIMIT :limit OFFSET :offset;`,
			{
				replacements: {
					userId: requestedUserId,
					search: `%${search}%`,
					limit,
					offset,
				},
				type: db.QueryTypes.SELECT,
			}
		);
		res.status(200).json(friends);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// --delete user, Only for web app
exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {user_id: req.body.user_id},
		});
		if (user) {
			const validPassword = await bcrypt.compare(req.body.password, user.password);
			if (validPassword) {
				const state = await user.destroy();
				state ? res.status(200).json('success') : res.status(403).json('Database errorr, try again later');
			} else {
				res.status(401).json('wrong password');
			}
		} else {
			res.status(402).json('There is no any Account for this Email.');
		}
	} catch (error) {
		res.status(500).json(errorr.message);
	}
};
