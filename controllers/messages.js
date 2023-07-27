const snakeKeys = require('snakecase-keys');
const {User, Message} = require('../models/User');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
                return res.status(402).json("User id can't be string!");
            case 'SequelizeForeignKeyConstraintError':
                return res.status(402).json("user does not exist for message");
        }

        res.status(500).json(error.message);
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