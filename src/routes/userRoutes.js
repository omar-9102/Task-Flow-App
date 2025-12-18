const express = require('express')
const router = express.Router()
const allowedTo = require('../middleware/allowTo');
const {userRules} = require('../utils/userRules')
const { verifyToken } = require('../middleware/verifyToken');
const userController = require('../controllers/user.controller')
const validate = require('../middleware/validate')
const userValidators = require('../validators/user.validator')
const {uploadUserAvatar} = require('../config/multerConfig')

router.route('/login').post(validate(userValidators.loginSchema), userController.login)
router.route('/register').post(validate(userValidators.registerSchema), uploadUserAvatar.single('avatar'), userController.register)    
router.route('/').get(verifyToken, allowedTo(userRules.ADMIN), userController.getAllUsers)
router.route('/update-profile').patch(verifyToken, allowedTo(userRules.USER), uploadUserAvatar.single('avatar'), userController.updateUserInfo)

module.exports = router
