const express = require('express');
const { genarateURL } = require('../controllers/aws');

const router = express.Router();

router.route('/sign-s3').get(genarateURL);

module.exports = router;