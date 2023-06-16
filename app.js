const dotenv = require('dotenv');
const express = require('express');
const aws = require('aws-sdk');

const cors = require('cors');

// const path = require('path');

const { connectDB } = require('./config/db');

// load envs
dotenv.config({ path: './config/.env' });
aws.config.region = 'ap-south-1';

// connect to db

connectDB();

const usersRout = require('./router/users');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/users', usersRout);

const S3_BUCKET = process.env.S3_BUCKET;

app.get('/api/sign-s3', (req, res) =>{
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        }
        res.write(JSON.stringify(returnData));
        res.end();
    });
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on PORT: ${PORT}`));
