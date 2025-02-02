const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Function to create a JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '30d' })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Attempt to find and login the user
    const user = await User.login(email, password)

    // If login is successful, create a token
    const token = createToken(user._id)

    // Respond with user email and token
    res.status(200).json({ user: { email: user.email }, token })
  } catch (error) {
    // If error occurs, send a 400 status with the error message
    res.status(400).json({ error: error.message })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Attempt to signup the user
    const user = await User.signup(email, password)

    // If signup is successful, create a token
    const token = createToken(user._id)

    // Respond with user email and token
    res.status(200).json({ user: { email: user.email }, token })
  } catch (error) {
    // If error occurs, send a 400 status with the error message
    res.status(400).json({ error: error.message })
  }
}

module.exports = { signupUser, loginUser }
