const serverError = require("../utils/serverErrors")
const httpStatusText = require('../utils/httpStatusText')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) =>{
    const authHeader = req.headers.Authorization || req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(serverError.create("You must login", 400, httpStatusText.ERROR))
    }
    const token = authHeader.split(' ')[1]
    try{
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = currentUser
        next();
    }catch(err){
        return next(serverError.create("Invalid token", 400, httpStatusText.ERROR))
    }
}

module.exports = {verifyToken}