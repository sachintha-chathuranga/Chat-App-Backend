const {User} = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.updateAccessToken = async (req, res) => {
    const cookies = req.cookies;
    try {
        if(!cookies.jwt) return res.status(401).json('JWT not in cookies');
        const refreshToken = cookies.jwt;
        const user = await User.findOne({
            attributes: {
                exclude: ['refresh_token', 'password']
            },
            where: {refresh_token: refreshToken}
        });
        if(!user) return res.status(403).json('user not found');
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) =>{
                if(err || user.dataValues.user_id!==decoded.user_id) return res.status(403).json('unautherize');
                const accessToken = jwt.sign(user.dataValues, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '60s'});
                res.status(200).json(accessToken);
            }
        )
    } catch (error) {
        res.status(402).json(error.message);
    }
}