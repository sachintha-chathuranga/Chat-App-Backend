const express = require('express');
const {getUser, updateUser, deleteUser, searhFriends, getRecentFriends, getFriends} = require('../controllers/users');
const {updateValidation} = require('../middleware/validation');
const router = express.Router();

//if request comming to this end point these function will execute
router.route('/recentFriends').get(getRecentFriends);
router.route('/friends').get(getFriends);
router.route('/search').post(searhFriends);
router.route('/').put(updateValidation, updateUser).delete(deleteUser);
router.route('/:id').get(getUser);

module.exports = router;
