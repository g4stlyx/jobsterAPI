const Job = require("../models/Job");
const {BadRequestError,UnauthorizedError, NotFoundError} = require("../errors/index");

const moment = require("moment")
const mongoose = require("mongoose")

const getAllJobs = async (req,res)=>{
    const {search,status,jobType,sort} = req.query

    const queryObject = {
        createdBy: req.user.userId
    }

    // searching and filtering
    if(search){
        queryObject.position = { $regex:search, $options:"i"}
    }
    if(status && status!== "all"){
        queryObject.status = status
    }
    if(jobType && jobType!== "all"){
        queryObject.jobType = jobType
    }

    let result = Job.find(queryObject)

    //sorting
    if(sort==="latest"){
        result= result.sort("-createdAt")
    }
    if(sort==="oldest"){
        result= result.sort("createdAt")
    }
    if(sort==="a-z"){
        result= result.sort("position")
    }
    if(sort==="z-a"){
        result= result.sort("-position")
    }

    //pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit

    result = result.skip(skip).limit(limit)

    const jobs = await result

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs/limit)

    res.status(200).json({jobs, totalJobs, numOfPages})
}

const getJob = async (req,res)=>{
    const {userId} = req.user
    const jobId = req.params.id
    const job = await Job.findOne({_id: jobId, createdBy: userId})
    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }
    res.status(200).json(job)
}

const createJob = async (req,res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(201).json(job)
}

const updateJob = async (req,res)=>{
    const {userId} = req.user
    const jobId = req.params.id
    const {company,position} = req.body

    if(company==="" || position===""){
        throw new BadRequestError("company and position are required")
    }

    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId},req.body,{new:true,runValidators:true})

    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }

    res.status(200).json(job)
}

const deleteJob = async (req,res)=>{
    const {userId} = req.user
    const jobId = req.params.id

    const job = await Job.findOneAndRemove({_id: jobId, createdBy: userId})

    if(!job){
        throw new NotFoundError(`No job found with id ${jobId}`)
    }

    res.status(200).json({removedJob:job})
}

// a bit advanced things going on here
const showStats = async(req,res)=>{

    let stats = await Job.aggregate([
        {$match:{createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{_id:"$status",count:{$sum:1}}}
    ])

    stats = stats.reduce((acc,curr)=>{
        const {_id:title,count} = curr
        acc[title] = count
        return acc
    },{})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications = await Job.aggregate([
        {$match:{createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{
            _id:{ year:{ $year:"$createdAt"}, month:{$month:"$createdAt"}},
            count:{$sum:1}
        }},
        {$sort:{"_id.year":-1,"_id.month":-1}},
        {$limit:12}
    ])

    monthlyApplications = monthlyApplications.map((item)=>{
        const {count} = item
        const {year,month} = item._id
        const date = moment().month(month-1).year(year).format("MMM Y")
        return {date,count}
    }).reverse()

    res.status(200).json({defaultStats,monthlyApplications})
}

module.exports = {getAllJobs, createJob,updateJob,deleteJob,getJob,showStats}