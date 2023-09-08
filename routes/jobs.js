const express = require('express');
const router = express.Router()

const {getAllJobs, createJob,updateJob,deleteJob,getJob,showStats} = require("../controllers/jobs")
const testUser = require("../middleware/testUser")

router.route("/").post(testUser,createJob).get(getAllJobs)
router.route("/stats").get(showStats)
router.route("/:id").get(getJob).patch(testUser,updateJob).delete(testUser,deleteJob)

module.exports = router