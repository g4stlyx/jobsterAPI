const express = require('express');
const router = express.Router()

const authenticateUser = require("../middleware/authentication")
const {register,login,updateUser} = require("../controllers/auth")
const testUser = require("../middleware/testUser")

const rateLimiter = require("express-rate-limit")
const apiLimiter = rateLimiter({
    windowMS: 15 * 60 * 1000, // 15 minutes
    max: 10, // max request count in 15 mins
    message:{
        msg:"Too many requests from this IP, please try again after 15 minutes"
    }
})

router.post('/register',apiLimiter, register)
router.post('/login', apiLimiter, login)
router.patch("/updateUser",authenticateUser,testUser ,updateUser)

module.exports = router