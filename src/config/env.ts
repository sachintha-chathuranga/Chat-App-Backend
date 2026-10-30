const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
	path: path.resolve(process.cwd(), '.env.development'),
});

const requiredEnv = (name: string): string => {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}

	return value;
};

const env = {
	PORT: process.env.PORT || '5001',
	DB_NAME: requiredEnv('DB_NAME'),
	DB_USER: requiredEnv('DB_USER'),
	DB_PASSWORD: requiredEnv('DB_PASSWORD'),
	DB_HOST: requiredEnv('DB_HOST'),
	DB_PORT: Number(requiredEnv('DB_PORT')),
	AWS_ACCESS_KEY_ID: requiredEnv('AWS_ACCESS_KEY_ID'),
	AWS_SECRET_ACCESS_KEY: requiredEnv('AWS_SECRET_ACCESS_KEY'),
	S3_BUCKET: requiredEnv('S3_BUCKET'),
	ACCESS_TOKEN_SECRET: requiredEnv('ACCESS_TOKEN_SECRET'),
	REFRESH_TOKEN_SECRET: requiredEnv('REFRESH_TOKEN_SECRET'),
};

export default env;
