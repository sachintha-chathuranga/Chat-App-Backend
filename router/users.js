const express = require('express');

const { createUser, loginUser, getUser, updateUser, deleteUser, getFriends, searhFriends} = require('../controllers/users');
const { validation, updateValidation } = require('../middleware/validation');
const verifyJWT = require('../middleware/verifyJwT');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/signUp').post(validation, createUser);
router.route('/login').post(loginUser);
router.route('/friends/').get(getFriends);
router.route('/search/:id').post(searhFriends);
router.route('/:id').put(updateValidation, updateUser).delete(deleteUser);
router.route('/:id').get(getUser);

module.exports = router;
