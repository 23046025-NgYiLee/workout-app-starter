// userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw Error('Incorrect email');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Error('Incorrect password');

  return user;
};

// Static method to signup user
userSchema.statics.signup = async function (email, password) {
  const exists = await this.findOne({ email });
  if (exists) throw Error('Email already in use');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

module.exports = mongoose.model('User', userSchema);
