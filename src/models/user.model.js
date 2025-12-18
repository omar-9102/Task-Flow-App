const mongoose = require('mongoose')
const validator = require('validator')
const {userRules} = require('../utils/userRules')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Field must be a valid Email']
        
    },
    password: {
        type: String,
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    token:{
        type: String
    },
    role: {
        type: String,
        enum: [userRules.USER, userRules.ADMIN],  // Permissible values
        default: userRules.USER 
    },
    avatar: {
        type: String,
        default: 'uploads/images/default_value.png'
    }
});

module.exports = mongoose.model('User', userSchema)