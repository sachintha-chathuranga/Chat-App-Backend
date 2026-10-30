const {DataTypes} = require('sequelize');
const {db} = require('../config/db');

const Message = db.define(
	'message',
	{
		sender_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'user_id',
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
		receiver_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'user_id',
			},
			onDelete: 'CASCADE',
		},
		message: {
			type: DataTypes.STRING(255),
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
			allowNull: false,
		},
		is_read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
	}
);
module.exports = Message;