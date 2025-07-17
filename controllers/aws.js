const dotenv = require('dotenv');
const aws = require('aws-sdk');

dotenv.config({ path: './config/.env' });
aws.config.region = 'ap-south-1';
const S3_BUCKET = process.env.S3_BUCKET;

exports.genarateURL = (req, res) =>{
    const s3 = new aws.S3();
    const fileName = req.query['file_name'];
    const fileType = req.query['file_type'];
    const date = Date.now();
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: date+fileName,
        //# of milisecond of validation signurl time
        Expires: 2000,
        ContentType: fileType,
        ACL: 'public-read' // need to give putObjectACl permission to I AM user 
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${date+fileName}`
        }
        res.write(JSON.stringify(returnData));
        res.end();
    });
} 
exports.deletObj = async (req, res) =>{
    const s3 = new aws.S3();
    const fileName = req.query['file_name'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName
    };

    try {
        await s3.deleteObject(s3Params).promise();
        res.status(200).json("File delete  successfuly");
    } catch (error) {
        res.status(500).json("File doesn't delete");
    }
} 