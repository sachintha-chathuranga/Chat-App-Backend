import {NextFunction, Request, Response} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '../config/env';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader || typeof authHeader !== 'string') {
		return res.status(401).json('Unauthorized');
	}
	const token = authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json('Unauthorized');
	}
	jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(403).json('Invalid Token');
		req.user = decoded as JwtPayload;
		next();
	});
};

export default verifyJWT;
