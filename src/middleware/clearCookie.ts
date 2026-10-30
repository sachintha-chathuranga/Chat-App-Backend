import type {Request, Response, NextFunction} from 'express';

const clearCookie = (_req: Request, res: Response, next: NextFunction) => {
	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'none',
		secure: true,
		maxAge: 24 * 60 * 60 * 1000,
	});
	next();
};

export default clearCookie;
