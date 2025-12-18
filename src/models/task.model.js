const mongoose = require('mongoose')
const validator = require('validator')
const {taskStatus} = require('../utils/taskStatus')

// Define a formatter function for 'Africa/Cairo' time zone
const egyptDateFormatter = (timestamp) => {
    if (!timestamp) return null;

    // Options to achieve a format similar to "Dec 16, 2025" plus the time in Egypt
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Cairo', // Specify Egypt time zone
        hour12: false // Use 24-hour format
    };
    // Example locale 'en-GB' for DD/MM/YYYY style, or 'en-US' for the previous request's style
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
    // createdOn:{
    //     type: Date,
    //     default: Date.now
    // },
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