const User = require('../models/user.model')
const httpStatusText = require('../utils/httpStatusText')
const serverError = require('../utils/serverErrors')
const asyncWrapper = require('../middleware/asyncWrapper')
const bcrypt = require('bcrypt')
const generateJWT = require('../utils/generateJWT')
const { expression } = require('joi')
const pickAllowedFields = require('../utils/allowedFields')
const fs = require('node:fs')
const path = require('path')


exports.getAllUsers = asyncWrapper(async(req, res, next) =>{
    const users = await User.find({}, {"__v": false, "password": false})
    // res.json({"status": httpStatusText.SUCCESS, "data": {users}})
    res.json({"status": httpStatusText.SUCCESS, "data":{users}})
})

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
    if (req.file) {
        newUser.avatar = req.file.path;
    }
    await newUser.save()
    const token = await generateJWT({id:newUser.id.toString(), role: newUser.role})
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
        const token = await generateJWT({id:user.id.toString(), role: user.role})
        console.log(token)
        return res.status(202).json({status: httpStatusText.SUCCESS, data:{token}})
    }else{
        return next(serverError.create("Something went wrong", 500, httpsStatusText.ERROR))
    }
})

exports.updateUserInfo = asyncWrapper(async(req, res, next) =>{
    console.log("get in update info")
    const userId = req.user._id || req.user.id
    const allowedUpdates = ['firstName', 'lastName', 'username', 'email']
    const updates = pickAllowedFields(req.body, allowedUpdates)
// 2. Handle Avatar Update
    if (req.file) {
        // Find the user first to get the old avatar path
        const user = await User.findById(userId);  
        const fullPath = path.resolve(user.avatar);      
        // Delete the old file from storage (if it's not the default one)
        if (fs.existsSync(fullPath)) {
            // Use fs.unlink to remove the physical file
            fs.unlink(fullPath, (err) => {
                if (err) console.error("Failed to delete old avatar:", err);
            });
        }else{
            console.log("File not found at:", fullPath);
        }
        // Add the new path to the updates object
        updates.avatar = req.file.path;
    }
    if(Object.keys(updates).length == 0)
        return next(serverError.create("No updates provided", 400, httpStatusText.ERROR))

    const updatedUser = await User.findByIdAndUpdate(userId,updates,{new: true,runValidators: true}).select('-password -role -__v');

    if (!updatedUser) {
        return res.status(404).json({status: httpStatusText.FAIL,message: 'User not found'});}
    res.status(200).json({status: httpStatusText.SUCCESS,data: { user: updatedUser }});
})
