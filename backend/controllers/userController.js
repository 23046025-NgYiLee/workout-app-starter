// userController.js
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.status(200).json({email: user.email, token})  // Ensure the correct response structure
  } catch (error) {
    res.status(400).json({error: error.message || 'An error occurred during login.'})  // Always return a message
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.signup(email, password)
    const token = createToken(user._id)
    res.status(200).json({email: user.email, token})  // Ensure the correct response structure
  } catch (error) {
    res.status(400).json({error: error.message || 'An error occurred during signup.'})  // Always return a message
  }
}

module.exports = { signupUser, loginUser }
