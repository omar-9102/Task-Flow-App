const User = require('../models/user.model')
const httpStatusText = require('../utils/httpStatusText')
const serverError = require('../utils/serverErrors')
const asyncWrapper = require('../middleware/asyncWrapper')
const bcrypt = require('bcrypt')
const generateJWT = require('../utils/generateJWT')
const { expression } = require('joi')

exports.register = asyncWrapper(async(req, res, next)=>{
    const {firstName, lastName, username, email, password, role} = req.body
    const oldEmail = await User.findOne({email: email})
    if(oldEmail){
        const error = serverError.create("Email already exist", 400, httpStatusText.FAIL)
        return next(error)
    }
    const oldUsername = await User.findOne({username: username})
    if(oldUsername){
        const error = serverError.create("username already exist", 400, httpStatusText.FAIL)
        return next(error)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({firstName, lastName, username, email, password: hashedPassword, role})
    await newUser.save()
    const token = generateJWT({id: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role })
    res.status(201).json({status: httpStatusText.SUCCESS,data: {newUser}, token:{token}})
})

exports.login = asyncWrapper(async(req, res, next) =>{
    const {email, password} = req.body
    if(!email || !password)
        return next (serverError.create("Email and password are required", 400, httpsStatusText.ERROR))
    const user = await User.findOne({email: email})
    if(!user)
        return next(serverError.create("Email not found please register", 400, httpStatusText.ERROR))
    const hashedPassword = await bcrypt.compare(password, user.password)
    if(!hashedPassword)
        return next(serverError.create("Password incorrect", 400, httpStatusText.ERROR))
    if(user && hashedPassword){
        const token = await generateJWT({_id:user.id, email: user.email, username: user.username, password: user.password, role: user.role})
        return res.status(202).json({status: httpStatusText.SUCCESS, data:{token}})
    }else{
        return next(serverError.create("Something went wrong", 500, httpsStatusText.ERROR))
    }
})

exports.getAllUsers = asyncWrapper(async(req, res, next) =>{
    const users = await User.find({}, {"__v": false, "password": false})
    // res.json({"status": httpStatusText.SUCCESS, "data": {users}})
    res.json({"status": httpStatusText.SUCCESS, "data":{users}})
})