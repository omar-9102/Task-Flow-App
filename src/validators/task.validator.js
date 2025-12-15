const Joi = require('joi')
const { taskStatus } = require('../utils/taskStatus')

const createTaskSchema = Joi.object({
    taskTitle: Joi.string().min(3).max(70).required().messages({
        'string.base' : 'Task title should be of type text',
        'string.empty': 'Task title cannot be empty',
        'string.min': `Task title should have a minimum length of 3 characters`,
        'any.required': `Task title is a required field`
    }),
    taskContent: Joi.string().min(1).max(300).required().messages({
        'string.base' : 'Task content should be of type text',
        'string.empty': 'Task content cannot be empty',
        'string.min': `Task content should have a minimum length of 1 character`,
        'any.required': `Task content is a required field`
    }),
    status: Joi.string().valid(taskStatus.COMPLETED, taskStatus.PENDING).messages({
        'string.base' : 'Status must be from [COMPLETED, PENDING]',
        'string.empty': 'Status must be from [COMPLETED, PENDING]',
        'string.min': `Status must be from [COMPLETED, PENDING]`,
        'any.required': `Status must be required from [COMPLETED, PENDING]`
    }),
    createdOn: Joi.date().optional()
})

const updateTaskSchema = Joi.object({
    taskTitle: Joi.string().min(3).max(70).optional(),
    taskContent: Joi.string().min(1).max(300).optional(),
    status: Joi.string().valid(taskStatus.COMPLETED, taskStatus.PENDING).optional,
    createdOn: Joi.date().optional()
})

module.exports = {
    createTaskSchema,
    updateTaskSchema
}
