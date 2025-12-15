const mongoose = require('mongoose')

const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("MongoDB connected successfully")
    }catch(err){
        console.error("MongoDB connection failed", err.message)
        process.exit(1)
    }
}

module.exports = dbConnection