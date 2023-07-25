const express = require('express');

const { createUser, loginUser, getUser, updateUser, deleteUser, getFriends, createMsg, getMsgs, searhFriends, getLastMsg, deleteMsgs} = require('../controllers/users');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/signUp').post(createUser)
router.route('/login').post(loginUser);
router.route('/friends/').get(getFriends);
router.route('/search/:id').post(searhFriends);
router.route('/message').post(createMsg).get(getMsgs);
router.route('/messages/clear/:id').delete(deleteMsgs);
router.route('/msg').get(getLastMsg);
router.route('/:id').put(updateUser).delete(deleteUser);
router.route('/:id').get(getUser);

module.exports = router;
