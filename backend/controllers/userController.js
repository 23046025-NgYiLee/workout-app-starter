const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.signup(email, password)

    // create a token
    const token = createToken(user._id)

    // Send back the email and token to the client
    res.status(200).json({ email: user.email, token })  // Returning user email and token

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { signupUser }
