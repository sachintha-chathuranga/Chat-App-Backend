import {Sequelize} from 'sequelize';
import env from './env';

const db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
	host: env.DB_HOST,
	port: env.DB_PORT,
	dialect: 'mysql',
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
