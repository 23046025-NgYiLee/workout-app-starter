const express = require('express')
const { signupUser, loginUser } = require('../controllers/userController')

const router = express.Router()

// POST request for signup
router.post('/signup', signupUser)

// POST request for login
router.post('/login', loginUser)

module.exports = router
