const {Sequelize} = require('sequelize');

const dotenv = require('dotenv');

dotenv.config({path: './config/.env'});
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DIALECT = process.env.DB_DIALECT;

exports.db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: DB_DIALECT,
	logging: false,
	dialectOptions: {
		charset: 'utf8mb4',
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

exports.connectDB = async () => {
	try {
		await this.db.authenticate();
		console.log(`MySql Connected: localhost`);
	} catch (error) {
		console.error('Unable to connect', error);
	}
};
