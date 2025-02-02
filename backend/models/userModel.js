const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// static signup method
// static signup method
userSchema.statics.signup = async function(email, password) {
    // validation
    if (!email || !password) {
      throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
      throw Error('Email not valid')
    }
  
    // Custom password validation (optional)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/
    if (!passwordRegex.test(password)) {
      throw Error('Password must be at least 8 characters long and include at least one number and one symbol.')
    }
  
    const exists = await this.findOne({ email })
    if (exists) {
      throw Error('Email already in use')
    }
  
    // Hash the password
    const salt = await bcrypt.genSalt(10)  // Increase salt rounds for better security
    const hash = await bcrypt.hash(password, salt)
  
    // Create and save the user
    const user = await this.create({ email, password: hash })
    return user
  }
  

// static login method
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)