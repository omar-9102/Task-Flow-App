const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const httpStatusText = require('./utils/httpStatusText')
const path = require('path')
// app.use('./uploads', express.static(path.join(__dirname,'/uploads')))
// const multer = require('multer');
// const upload = multer();

const taskRouter = require('./routes/taskRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/tasks', taskRouter)
app.use('/api/users', userRouter)

//! Global Error Handler
app.use((error, req, res, next) =>{
    res.status(error.statusCode || 500)
    .json({status: error.statusCode || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500});
})

module.exports = app;