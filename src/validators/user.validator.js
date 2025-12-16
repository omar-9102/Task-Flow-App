const Joi = require('joi')
const { taskStatus } = require('../utils/taskStatus')
const {userRules} = require('../utils/userRules')

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(70).required().messages({
        'string.base' : 'First name should be of type text',
        'string.empty': 'First name cannot be empty',
        'string.min': `First name should have a minimum length of 3 characters`,
        'any.required': `First name is a required field`
    }),
    lastName: Joi.string().min(3).max(70).required().messages({
        'string.base' : 'Last name should be of type text',
        'string.empty': 'Last name cannot be empty',
        'string.min': `Last name should have a minimum length of 3 characters`,
        'any.required': `Last name is a required field`
    }),
    username: Joi.string().min(3).max(70).required().messages({
        'string.base' : 'Username should be of type text',
        'string.empty': 'Username cannot be empty',
        'string.min': `Username should have a minimum length of 3 characters`,
        'any.required': `Username is a required field`
    }),
    email: Joi.string().email().required().messages({
        'string.base' : 'Email should be of type text',
        'string.empty': 'Email cannot be empty',
        'string.email': `Email must be a valid email address`,
        'any.required': `Email is a required field`
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.base' : 'Password should be of type text',
        'string.empty': 'Password cannot be empty',
        'string.min': `Password should have a minimum length of 6 characters`,
        'any.required': `Password is a required field`
    }),
    role: Joi.string().valid(userRules.USER, userRules.ADMIN).messages({
        'string.base' : 'Role must be from [USER, ADMIN]',
        'string.empty': 'Role can not be empty',
        'string.min': `Role must be at least 3 characters`,
        'any.required': `Role is required`
    }),
})

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base' : 'Email should be of type text',
        'string.empty': 'Email cannot be empty',
        'string.email': `Email must be a valid email address`,
        'any.required': `Email is a required field`
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.base' : 'Password should be of type text',
        'string.empty': 'Password cannot be empty',
        'string.min': `Password should have a minimum length of 6 characters`,
        'any.required': `Password is a required field`
    }),
})
module.exports = {
    registerSchema,
    loginSchema
}