import express from "express";
import {deletObj, genarateURL} from '../controllers/aws';

const router = express.Router();

router.route('/sign-s3').get(genarateURL);
router.route('/sign-s3/delete').delete(deletObj);

export default router;
