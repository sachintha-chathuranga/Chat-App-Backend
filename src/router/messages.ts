import express from 'express';

import {createMsg, deleteMsgs, getAllUnreadMsgs, getLastMsg, getMsgs, updateMsg} from '../controllers/messages';

const router = express.Router();

//if request comming to this end point these function will execute
router.route('/message').post(createMsg).get(getMsgs);
router.route('/messages/clear').delete(deleteMsgs);
router.route('/messages/notifications').get(getAllUnreadMsgs);
router.route('/messages/update').put(updateMsg);
router.route('/msg').get(getLastMsg);

export default router;
