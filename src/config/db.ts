import {Sequelize} from 'sequelize';
import type {Dialect} from 'sequelize';

const DB_NAME:string = process.env.DB_NAME || "chatapp";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_DIALECT = process.env.DB_DIALECT || "mysql" ;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: DB_DIALECT as Dialect,
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
export const connectDB = async () => {
	try {
		await db.authenticate();
		console.log('Database connected');
		
		await db.sync({alter: false});
		console.log('Database synchronized');
	} catch (error) {
		console.error('Unable to connect Database!', error);
		throw error;
	}
};
export default db;
