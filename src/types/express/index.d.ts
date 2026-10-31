import type {JwtPayload} from 'jsonwebtoken';
import { User } from '../user';

declare global {
	namespace Express {
		interface Request {
			user?: User | JwtPayload;
		}
	}
}

export {};
