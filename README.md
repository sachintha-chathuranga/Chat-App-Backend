# Social Chating React App.

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




