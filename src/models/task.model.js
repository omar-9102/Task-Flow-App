const mongoose = require('mongoose')
const validator = require('validator')
const {taskStatus} = require('../utils/taskStatus')

const taskScheme = new mongoose.Schema({
    taskTitle:{
        type: String,
        required: true
    },
    taskContent: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: [taskStatus.COMPLETED, taskStatus.PENDING],
        default: taskStatus.PENDING
        },
    createdOn:{
        type: Date,
        dafault: Date.now
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Task', taskScheme)