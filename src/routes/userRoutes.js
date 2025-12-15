const express = require('express')
const router = express.Router()
const allowedTo = require('../middleware/allowTo');
const {userRules} = require('../utils/userRules')
const { verifyToken } = require('../middleware/verifyToken');
const userController = require('../controllers/user.controller')
// const validate = require('../middleware/validate')
// const taskValidators = require('../validators/task.validator')

router.route('/login').post(userController.login)
router.route('/register').post(userController.register)
router.route('/').get(verifyToken, allowedTo(userRules.ADMIN), userController.getAllUsers)


// router.route('/:taskId')
//         .patch(validate(taskValidators.updateTaskSchema), taskController.updateTask)
//         .delete(taskController.deleteTask)
module.exports = router
