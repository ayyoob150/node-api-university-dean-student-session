const signup = require('../controller/userSignup')
const login = require("../controller/userLogin")
const express = require('express');
const router = express.Router();


router.post('/signup',signup)
router.post('/login',login)



module.exports =router