const {DataTypes} = require('sequelize');
const {db} = require('../config/db');

const User = db.define(
	'user',
	{
		user_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		about: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		fname: {
			type: DataTypes.STRING,

			validate: {
				isAlpha: true,
			},
		},
		lname: {
			type: DataTypes.STRING,

			validate: {
				isAlpha: true,
			},
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		phone: {
			type: DataTypes.STRING,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
		},
		profil_pic: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		refresh_token: {
			type: DataTypes.TEXT,
		},
	},
	{
		timestamps: false,
	}
);

export default User;
