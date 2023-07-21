const snakeKeys = require('snakecase-keys');
const {User, Message} = require('../models/User');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --create User
exports.createUser = async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(req.body.password, salt);
            const newUser = await User.create( {
                fname : req.body.fname,
                lname : req.body.lname,
                email : req.body.email,
                password : hashPass
            });
            !newUser ? res.status(400).json('user not created') : res.status(200).json(null);
        } catch (error) {
            let errors = [];

            switch (error.name) {
                case 'SequelizeValidationError':
                    error.errors.map((e) => {
                        switch (e.message){
                            case 'Validation isAlpha on fname failed':
                               errors.push("Please enter only alphabetic characters in first name field!");
                               break;
                            case  'Validation isAlpha on lname failed':
                                errors.push("Please enter only alphabetic characters in last name field!");
                               break;
                            case  'Validation isEmail on email failed':
                                errors.push("Invalid type of Email Address!");
                               break;
                        }
                    });
                    return res.status(401).json(errors[0]);
                case 'SequelizeUniqueConstraintError':
                    return res.status(402).json("Email Alredy Exist. Try Another One!");
            }
            res.status(403).json(error.message);
        }
};

// login userr
exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: {
                exclude: ['refresh_token']
            },
            where: {email: req.body.email}
        });
        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(validPassword){
                const obj = JSON.parse(JSON.stringify(user));
                delete obj.password;
                const accessToken = jwt.sign(obj,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15min'});
                const refreshToken = jwt.sign(obj,process.env.REFRESH_TOKEN_SECRET,{expiresIn: '1d'});
                const data = await user.update({status: true, refresh_token: refreshToken});
                res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000});
                res.status(200).json({...obj, status: true, access_token: accessToken});
            }else{res.status(400).json("wrong password")}
        }else{
            res.status(402).json("There is no any Account for this Email.");
        } 
    } catch (error) {
        res.status(403).json(error.message);
    }
};

exports.logoutUser = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies.jwt) return res.status(401).json('JWT not in cookies for logout request');
    try {
        const refreshToken = cookies.jwt;
        const user = await User.findOne({
            attributes: {
                exclude: ['refresh_token', 'password']
            },
            where: {refresh_token: refreshToken}
        });
        if(user) {
            const data = await user.update({status: false, refresh_token: null});
            res.clearCookie('jwt', {httpOnly: true, samesite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
            res.status(200).json('logout success!');
        }
        res.status(404).json('user not found');
    } catch (error) {
        res.status(402).json(error.message);
    }
}

// --update PUT

exports.updateUser = async (req, res) => {
        try {
            if(req.body.password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = await User.findOne({ 
                attributes: {
                    exclude: ['refresh_token', 'password']
                },
                where: { user_id: req.user.user_id }
             });
            const state = await user.update({ ...snakeKeys(req.body) });
            !state ? res.status(400).json("user not update") : res.status(200).json({...user.dataValues, access_token: req.headers['authorization'].split(' ')[1] });
        } catch (error) {
            let errors = [];

            switch (error.name) {
                case 'SequelizeValidationError':
                    error.errors.map((e) => {
                        switch (e.message){
                            case 'Validation isAlpha on fname failed':
                               errors.push("Please enter only alphabetic characters in first name field!");
                               break;
                            case  'Validation isAlpha on lname failed':
                                errors.push("Please enter only alphabetic characters in last name field!");
                               break;
                            case  'Validation isEmail on email failed':
                                errors.push("Invalid type of Email Address!");
                               break;
                        }
                    });
                    return res.status(401).json(errors[0]);
                case 'SequelizeUniqueConstraintError':
                    return res.status(402).json("Email Alredy Exist. Try Another One!");
            }
            res.status(403).json(error.message);
        }
   
};


// get a user by id or params
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: {
                exclude: ['password', 'email', 'refresh_token']
            },
            where: { user_id: req.params.id }
         });
        !user ? res.status(404).json('User Not Found') : res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

//  get all user friends
exports.getFriends = async (req, res) => {
    const offset = req.query.index ? (15 * (parseInt(req.query.index) - 1)) : null;
    try {
        const friends = await User.findAll({
            offset,
            attributes: {
                exclude: ['password', 'email', 'refresh_token']
            },
            where: {
                status: true,
                [Op.not]: [{
                    user_id: req.user.user_id
                }]
            },
            limit: 15
        });
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.searhFriends = async (req, res) =>{
    const offset = req.query.index ? (15 * (parseInt(req.query.index) - 1)) : null;
    try {
        const friends = await User.findAll({
            offset,
            limit: 15,
            attributes: {
                exclude: ['password', 'email', 'refresh_token']
            },
            where: {
                [Op.and]: [{
                    [Op.not]: [{
                        user_id: req.user.user_id
                    }]}
                    ,{
                    [Op.or]: [{
                        fname: {
                            [Op.like]: `${req.body.name}%`
                        }
                    },{
                        lname: {
                            [Op.like]: `${req.body.name}%`
                        }
                    }]}]
            }
        });
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json(error);
    }
}

// --delete DELETE
exports.deleteUser = async (req, res) => {
        try {
             const user = await User.findOne({
                where: {user_id: req.body.user_id}
            });
            if(user){
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if(validPassword){
                    const state = await user.destroy();
                    state ? res.status(200).json('success') : res.status(403).json('Database errorr, try again later');
                }else{
                    res.status(401).json("wrong password");
                }
            }else{
                res.status(402).json("There is no any Account for this Email.");
            }
        } catch (error) {
            res.status(500).json(errorr.message);
        }
};



