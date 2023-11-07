const { meetDeanStudent,studentAppoinment,deanAppoinment,freeSession } = require('../controller/session')
const express = require('express');
const router = express.Router();
const authorization = require("../middleware/authorization")


router.post('/student/appointment',authorization("student"),meetDeanStudent)
router.get('/student/appointment/',authorization("student"),studentAppoinment)
router.get('/dean/appointment/',authorization("dean"),deanAppoinment)
router.get('/student/free-session/',authorization("student"),freeSession)

module.exports =router