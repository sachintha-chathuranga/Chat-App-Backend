const express = require('express');

const { createMsg, getMsgs, getLastMsg, deleteMsgs, updateMsg, getAllUnreadMsgs} = require('../controllers/messages');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/message').post(createMsg).get(getMsgs);
router.route('/messages/clear').delete(deleteMsgs);
router.route('/messages/notifications').get(getAllUnreadMsgs);
router.route('/messages/update').put(updateMsg);
router.route('/msg').get(getLastMsg);

module.exports = router;