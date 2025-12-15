const express = require('express')
const {join} = require('path')
require('dotenv').config({path: join(__dirname, '.env')})
const dbConnection = require('./src/config/db')
const app = require('./src/app')

dbConnection();

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening....`)
})