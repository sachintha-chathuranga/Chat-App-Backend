const express = require('express');
const { genarateURL, deletObj } = require('../controllers/aws');

const router = express.Router();

router.route('/sign-s3').get(genarateURL);
router.route('/sign-s3/delete').delete(deletObj);

module.exports = router;