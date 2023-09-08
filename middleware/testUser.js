const {BadRequestError} = require("../errors/index")

const testUser = (req,res,next)=>{
    if(req.user.testUser){
        throw new BadRequestError("Test user. READ ONLY!")
    }
    next()
}

module.exports = testUser