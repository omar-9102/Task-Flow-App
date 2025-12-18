const express = require('express')
const router = express.Router()
const {verifyToken} = require('../middleware/verifyToken')
const taskController = require('../controllers/task.controller')
const validate = require('../middleware/validate')
const taskValidators = require('../validators/task.validator')
const allowedTo = require('../middleware/allowTo')
const {userRules} = require('../utils/userRules')
const {uploadTaskFiles} = require('../config/multerConfig')

router.route('/getAllTasks').get(verifyToken,allowedTo(userRules.ADMIN), taskController.getAllTasks)
router.get('/me', verifyToken, allowedTo(userRules.USER), taskController.getMyTasks);
router.get('/getUserTasks', verifyToken, allowedTo(userRules.USER), taskController.getUserTasks)
router.route('/').post(verifyToken, allowedTo(userRules.USER),uploadTaskFiles.array('taskFiles', 5), validate(taskValidators.createTaskSchema), taskController.createTask)
router.route('/:taskId')
        .patch(verifyToken, allowedTo(userRules.USER), validate(taskValidators.updateTaskSchema),uploadTaskFiles.array('taskFiles', 5),  taskController.updateTask)
        .delete(verifyToken, allowedTo(userRules.USER), taskController.deleteTask)
module.exports = router
