const { Sequelize } = require('sequelize');

// const express = require('express');
// const dotenv = require('dotenv');/

// load envs
// dotenv.config();

exports.db = new Sequelize('chatApp' , 'root', '21356',{
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

exports.connectDB = async () => {;
    try{
        await this.db.authenticate();
        console.log(`MySql Connected: localhost`);
    }catch(error){
        console.error('Unable to connect', error);
    }
    
};