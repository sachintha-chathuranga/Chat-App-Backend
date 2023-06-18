const dotenv = require('dotenv');
const aws = require('aws-sdk');

dotenv.config({ path: './config/.env' });
aws.config.region = 'ap-south-1';
const S3_BUCKET = process.env.S3_BUCKET;

exports.genarateURL = (req, res) =>{
    const s3 = new aws.S3();
    const fileName = req.query['file_name'];
    const fileType = req.query['file_type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        //# of second of validation signurl time
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
} 