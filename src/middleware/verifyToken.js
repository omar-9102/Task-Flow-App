const serverError = require("../utils/serverErrors")
const httpStatusText = require('../utils/httpStatusText')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const verifyToken = async (req, res, next) =>{
    const authHeader = req.headers.Authorization || req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(serverError.create("You must login", 400, httpStatusText.ERROR))
    }
    const token = authHeader.split(' ')[1]
    try{
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = currentUser.id || currentUser._id
        const user = await User.findById(userId).select('_id role')
        if(!user){
            return next(serverError.create("User not found", 404, httpStatusText.FAIL))
        }
        req.user = {
            _id: user._id,
            id: user._id.toString(),
            role: user.role
        }
        next()
    }catch(err){
        return next(serverError.create("Invalid token", 400, httpStatusText.ERROR))
    }
}

module.exports = {verifyToken}
