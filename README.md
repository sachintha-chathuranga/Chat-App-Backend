# Social Chatting App.

This project was create using Node.js.
This is a backend code for chat app. which handle the request comming from frontend. if you want to run this app on your local envirement, follow the following instruction.

## Instruction for the run the application in local envirement.

1.clone the repository into your local computer.

2.create .env file inside config directory and add the following variable in to it. 

    PORT=5000  
    DB_NAME="Replace this with your mysql Database name"
    DB_USER="Replace this with your database user name"
    DB_PASS="Replace this whth your database password"
    DB_HOST=localhost
    DB_PORT=3306("you can replace this with your database port")
    DB_DIALECT=mysql
    AWS_ACCESS_KEY_ID="Replace this with your own aws access key id"
    AWS_SECRET_ACCESS_KEY="Replace this with your own aws secret access key"
    S3_BUCKET="Replace this with your own aws bucket name"
    ACCESS_TOKEN_SECRET="For this you can give any secret key you want"
    REFRESH_TOKEN_SECRET="For this also you can give any secret you want"
    
3.run the command `npm install`. this will install all the dependency.

4.run the command `npm start`.

To run this app corectly you need to have make sure mysql database install in your computer and run in on port number 3306.
you can get aws-access-key-id and aws-secret-access-key after creating aws account. after that you need to create s3 bucket. But you can run aplication without setting up AWS bucket related envirement variable. In that case you cannot upload and image within this app.

you can get frontend code related to this app by [click here.](https://github.com/sachintha-chathuranga/Chat-App-Frontend)


## Setup AWS S3 bucket permissions.

1.Create S3 bucket in AWS.

2.Go to permission tab and go to Block public access (bucket settings) section and give permission to public access.

3.Then create new bucket policy as below.
    `{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Statement1",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject"
                ],
                "Resource": "arn:aws:s3:::aws-chatapp-bucket/*"
            }
        ]
    }`
4.After that create new I AM role with following police.
    `
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Statement1",
                "Effect": "Allow",
                "Action": [
                    "s3:PutObject",
                    "s3:DeleteObject",
                    "s3:GetObject",
                    "s3:PutObjectAcl"
                ],
                "Resource": [
                    "arn:aws:s3:::aws-chatapp-bucket/*"
                ]
            }
        ]
    }
    `
4.Then go to Object Ownership section and Enable the ACls.

5.After add CORS setting as follow.
    `
        [
            {
                "AllowedHeaders": [
                    "*"
                ],
                "AllowedMethods": [
                    "PUT",
                    "POST",
                    "HEAD",
                    "DELETE"
                ],
                "AllowedOrigins": [
                    "*"
                ],
                "ExposeHeaders": []
            }
        ]
    `
