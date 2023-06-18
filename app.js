const dotenv = require('dotenv');
const express = require('express');

const cors = require('cors');

// const path = require('path');

const { connectDB } = require('./config/db');

// load envs
dotenv.config({ path: './config/.env' });

// connect to db

connectDB();

const usersRout = require('./router/users');
const awsRout = require('./router/aws');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/users', usersRout);
app.use('/api/aws', awsRout);



const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on PORT: ${PORT}`));
