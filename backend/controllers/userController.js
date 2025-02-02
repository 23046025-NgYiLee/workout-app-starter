const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Helper function to create a JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Attempt to login the user with the provided email and password
    const user = await User.login(email, password)

    // Create a token for the authenticated user
    const token = createToken(user._id)

    // Send back the user email and the token
    res.status(200).json({
      user: {
        email: user.email,  // Include other user info if necessary (e.g. user._id, etc.)
      },
      token,  // Return the token
    })
  } catch (error) {
    console.error('Login Error:', error.message)
    res.status(400).json({ error: 'Invalid credentials or server error' })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Attempt to signup the user with the provided email and password
    const user = await User.signup(email, password)

    // Create a token for the newly created user
    const token = createToken(user._id)

    // Send back the user email and the token
    res.status(200).json({
      user: {
        email: user.email,  // Include other user info if necessary
      },
      token,  // Return the token
    })
  } catch (error) {
    console.error('Signup Error:', error.message)
    res.status(400).json({ error: 'Signup failed or server error' })
  }
}

module.exports = { signupUser, loginUser }
