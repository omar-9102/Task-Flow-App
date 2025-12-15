const Task = require('../models/task.model')
const serverError = require('../utils/serverErrors')
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');


exports.getAllTasks = asyncWrapper(async (req,res) => {
    const query = req.query
    const limit = query.limit || 5
    const page = query.page || 1
    const skip = (page - 1) * limit
    const tasks = await Task.find({}, {'__v': false}).limit(limit).skip(skip)
    res.json({status:httpStatusText.SUCCESS, data:{tasks},tasksCount:tasks.length})
})

exports.getMyTasks = asyncWrapper(async(req, res, next) =>{
    const tasks = await Task.find({owner: req.user._id})
    res.status(200).json({status: httpStatusText.SUCCESS, data: {tasks}})
})

exports.createTask = asyncWrapper(async(req, res, next) =>{
    // const newTask = new Task(req.body)
    const task = await Task.create({
        taskTitle: req.body.taskTitle,
        taskContent: req.body.taskContent,
        status: req.body.status,
        owner: req.user._id
    })
    return res.status(201).json({status: 'success', data:{task}})
})

exports.updateTask = asyncWrapper(async(req, res, next) =>{
        const taskId = req.params.taskId;
        const updates = req.body
        const updatedTask = await Task.findByIdAndUpdate(taskId, {$set: updates}, {new: true, runValidators: true})
        if(!updatedTask)
            return res.status(404).json('Task Not Found')
        return res.status(200).json(updatedTask);}

) 

exports.deleteTask = asyncWrapper(async(req, res, next) =>{
    const taskId = req.params.taskId
    const task = await Task.deleteOne({_id: taskId})
    res.status(200).json({status: httpStatusText.SUCCESS, data: null})})