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

exports.getUserTasks = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const status = (req.query && req.query.status) || (req.body && req.body.status);
    // 1. Always start with the owner filter for security
    const filter = { owner: userId };
    // 2. Add status to filter ONLY if it is valid
    const validStatuses = ['COMPLETED', 'PENDING'];   
    if (status) {
        // Convert input to uppercase so "pending" or "PENDING" both work
        const upperStatus = status.toString().toUpperCase();
        if(!validStatuses.includes(upperStatus))
            return next(serverError.create('Enter a valid input' , 400, httpStatusText.ERROR))
    }
    // 3. Execute query once
    // If no status was provided, filter is just { owner: userId }, returning all.
    const tasks = await Task.find(filter);
    res.status(200).json({status: httpStatusText.SUCCESS,data: { tasks }, count: tasks.length});
});

exports.createTask = asyncWrapper(async(req, res, next) =>{
    let filePaths = [];
    if (req.files && req.files.length > 0)
        filePaths = req.files.map(file => file.path);
    const task = await Task.create({
        taskTitle: req.body.taskTitle,
        taskContent: req.body.taskContent,
        status: req.body.status,
        owner: req.user._id,
        taskFiles: filePaths
    })
    return res.status(201).json({status: 'success', data:{task}})
})

exports.updateTask = asyncWrapper(async(req, res, next) =>{
        const taskId = req.params.taskId;
        const updates = {...req.body}
        if (req.files && req.files.length > 0) {
            const newFilePaths = req.files.map(file => file.path);   
        // Option A: Append new files to the existing list ($push)
        // Option B: Overwrite the whole list (updates.taskFiles = newFilePaths)
        // Below we use Option A within the findByIdAndUpdate    
            updates.$push = { taskFiles: { $each: newFilePaths } };
    }
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {new: true, runValidators: true})
        if(!updatedTask)
            return res.status(404).json('Task Not Found')
        return res.status(200).json(updatedTask);}
) 

exports.deleteTask = asyncWrapper(async(req, res, next) =>{
    const taskId = req.params.taskId
    const task = await Task.deleteOne({_id: taskId})
    res.status(200).json({status: httpStatusText.SUCCESS, data: null})})