const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	console.log("Verify jwt");
	console.log(process.env.ACCESS_TOKEN_SECRET)
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader) return res.status(401).json('Unauthorize');
	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(403).json('Invalid Token');
		req.user = decoded;
		next();
	});
};

module.exports = verifyJWT;
