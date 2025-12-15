const httpStatusText = require('../utils/httpStatusText')
const serverError = require('../utils/serverErrors')

module.exports = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role))
            return next(serverError.create("Access denied", 401, httpStatusText.ERROR))
        next()
    }
}