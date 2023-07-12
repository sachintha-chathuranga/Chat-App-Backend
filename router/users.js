const express = require('express');

const { createUser, loginUser, logoutUser, getUser, updateUser, deleteUser, getFriends, searhFriends} = require('../controllers/users');
const { validation, updateValidation } = require('../middleware/validation');
const verifyJWT = require('../middleware/verifyJwT');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/signUp').post(validation, createUser);
router.route('/login').post(loginUser);
router.route('/friends').get(verifyJWT, getFriends);
router.route('/search').post(verifyJWT, searhFriends);
router.route('/logout').put(logoutUser);
router.route('/').put(verifyJWT, updateValidation, updateUser).delete(verifyJWT, deleteUser);
router.route('/:id').get(verifyJWT, getUser);

module.exports = router;
