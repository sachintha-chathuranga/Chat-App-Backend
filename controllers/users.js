const snakeKeys = require('snakecase-keys');
const {User, Message} = require('../models/User');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { validation, anyValidation } = require('./validation');

// --create User
exports.createUser = async (req, res) => {
        try {
            await validation(req.body.fname, req.body.lname, req.body.email, req.body.password);
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
            where: {email: req.body.email}
        });
        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(validPassword){
                user.status = true;
                const data = JSON.parse(JSON.stringify(user));
                delete data.password;
                await user.update({status: true});
                res.status(200).json(data)
            }else{res.status(400).json("wrong password")}
        }else{
            res.status(401).json("There is no any Account for this Email.");
        } 
    } catch (error) {
        res.status(402).json(error.message);
    }
};

// --update PUT

exports.updateUser = async (req, res) => {
        try {
            await anyValidation(req.body);
            if(req.body.password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = await User.findOne({ 
                attributes: {
                    exclude: ['password']
                },
                where: { user_id: req.params.id }
             });
            const state = await user.update({ ...snakeKeys(req.body) });
            const data = JSON.parse(JSON.stringify(user));
            delete data.password;
            !state ? res.status(400).json("user not update") : res.status(200).json(data);
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
    const userId = req.params.id;
    try {
        const user = await User.findOne({
            attributes: {
                exclude: ['password', 'email']
            },
            where: { user_id: userId }
         });
        !user ? res.status(404).json({ error: 'User Not Found' }) : res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

//  get all user friends
exports.getFriends = async (req, res) => {
    const offset = 15 * (parseInt(req.query.index) - 1);
    try {
        const friends = await User.findAll({
            offset,
            attributes: {
                exclude: ['password', 'email']
            },
            where: {
                [Op.not]: [{
                    user_id: req.query.user_id
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
                exclude: ['password', 'email']
            },
            where: {
                [Op.and]: [{
                    [Op.not]: [{
                        user_id: req.params.id
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
    if(req.body.user_id == req.params.id){
        try {
             const user = await User.findOne({
                where: {user_id: req.body.user_id}
            });
            if(user){
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if(validPassword){
                    const state = await user.destroy();
                    res.status(200).json('success');
                }else{
                    res.status(401).json("wrong password");
                }
            }else{
                res.status(402).json("There is no any Account for this Email.");
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }else{
        return res.status(403).json("You can delete only your account ");
    }
};

exports.createMsg = async (req, res) => {
    try {
        const newMsg = await Message.create( {
            sender_id : req.body.sender_id,
            receiver_id : req.body.receiver_id,
            message : req.body.message
        });
        !newMsg ? res.status(400).json('msg not store!') : res.status(200).json(newMsg);
    } catch (error) {
        let errors = [];

        switch (error.name) {
            case 'SequelizeValidationError':
                errors = error.errors.map((e) => e.message);
                return res.status(401).json({ error: errors });
            case 'SequelizeUniqueConstraintError':
                errors = ["Email Alredy Exist. Try Another One!"];
                return res.status(402).json({ error: errors });
        }

        res.status(500).json({ error });
    }
}

exports.deleteMsgs = async (req, res) => {
        try {
            const count = await Message.destroy({
                where: {
                    [Op.or]: [{
                        [Op.and]: [{
                            sender_id: req.params.id,
                            receiver_id: req.query.friend_id
                        }]},{
                        [Op.and]: [{
                            sender_id: req.query.friend_id,
                            receiver_id: req.params.id
                        }]
                    }]
                }
            });
            res.status(200).json(count);
        } catch (error) {
            res.status(500).json({ error });
        }
};

exports.getMsgs = async (req, res) =>{
    try {
        const msgs = await Message.findAll({
            where: {
                [Op.or]: [{
                    [Op.and]: [{
                        sender_id: req.query.user_id,
                        receiver_id: req.query.friend_id
                    }]},{
                    [Op.and]: [{
                        sender_id: req.query.friend_id,
                        receiver_id: req.query.user_id
                    }]
                }]
            },
            order: [['id', 'ASC']]
        });
        !msgs ? res.status(400).json('messages not available') : res.status(200).json(msgs);
    } catch (error) {
        res.status(500).json(error);
    }
}
exports.getLastMsg = async (req, res) =>{
    try {
        const msgs = await Message.findOne({
            where: {
                [Op.or]: [{
                    [Op.and]: [{
                        sender_id: req.query.user_id,
                        receiver_id: req.query.friend_id
                    }]},{
                    [Op.and]: [{
                        sender_id: req.query.friend_id,
                        receiver_id: req.query.user_id
                    }]
                }]
            },
            order: [['id', 'DESC']]
        });
        if(msgs && msgs.message.length > 30){
            msgs.message = msgs.message.substring(0, 30).concat(" ....");
        }
        !msgs ? res.status(201).json({message: 'No any messages yet!'}) : res.status(200).json(msgs);
    } catch (error) {
        res.status(500).json(error);
    }
}

