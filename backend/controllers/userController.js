const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email: user.email, token })
  } catch (error) {
    // Send a well-formed JSON response with an error message
    res.status(400).json({ error: error.message || 'Login failed' })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.signup(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email: user.email, token })
  } catch (error) {
    // Ensure we send a valid JSON response
    res.status(400).json({ error: error.message || 'Signup failed' })
  }
}

module.exports = { signupUser, loginUser }
