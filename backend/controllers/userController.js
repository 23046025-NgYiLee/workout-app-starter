// userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Create a JWT token for user authentication
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);

    // Send response with token
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    // Create a token
    const token = createToken(user._id);

    // Send response with token as JSON
    res.status(200).json({ email, token });
  } catch (error) {
    // Return an error response with a message
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
