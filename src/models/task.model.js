const mongoose = require('mongoose')
const validator = require('validator')
const {taskStatus} = require('../utils/taskStatus')

const egyptDateFormatter = (timestamp) => {
    if (!timestamp) return null;

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Cairo', 
        hour12: false 
    };
    return new Intl.DateTimeFormat('en-GB', options).format(timestamp); 
};

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
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskFiles: [{
        type: String,
        required: false
    }]
},{
    timestamps: true,
    toJSON: {getters: true, virtuals: true}
})

taskScheme.path('createdAt').get(egyptDateFormatter);
taskScheme.path('updatedAt').get(egyptDateFormatter);

module.exports = mongoose.model('Task', taskScheme)
