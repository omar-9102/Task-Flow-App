const express = require('express')
const router = express.Router()
const allowedTo = require('../middleware/allowTo');
const {userRules} = require('../utils/userRules')
const { verifyToken } = require('../middleware/verifyToken');
const userController = require('../controllers/user.controller')
const validate = require('../middleware/validate')
const userValidators = require('../validators/user.validator')



router.route('/login').post(validate(userValidators.loginSchema), userController.login)
router.route('/register').post(validate(userValidators.registerSchema), userController.register)    
router.route('/').get(verifyToken, allowedTo(userRules.ADMIN), userController.getAllUsers)
router.route('/update-profile').patch(verifyToken, allowedTo(userRules.USER), userController.updateUserInfo)
// router.patch('/update-info', verifyToken, allowedTo(userRules.USER), userController.updateUserInfo)

module.exports = router
