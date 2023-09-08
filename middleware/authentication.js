const User = require("../models/User")
const jwt = require("jsonwebtoken")
const {UnauthorizedError} = require("../errors/index")

const auth = async(req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthorizedError("Token is not provided")
    }
    const token = authHeader.split(" ")[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        // attach the user to the job routes
        const testUser = payload.userId === "64f8a2a20b4ce5d21a560088"
        req.user = {userId:payload.userId, testUser}
        next()
    }
    catch(err){
        throw new UnauthorizedError("Token is invalid")
    }
}

module.exports = auth