const express = require('express');

const { createMsg, getMsgs, getLastMsg, deleteMsgs} = require('../controllers/messages');

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/message').post(createMsg).get(getMsgs);
router.route('/messages/clear/:id').delete(deleteMsgs);
router.route('/msg').get(getLastMsg);

module.exports = router;