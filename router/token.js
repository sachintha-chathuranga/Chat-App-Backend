const express = require('express');
const { updateAccessToken } = require('../controllers/refreshTokenController');

const router = express.Router();

router.route('/update').get(updateAccessToken);

module.exports = router;