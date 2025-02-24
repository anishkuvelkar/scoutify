const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true, 
  },
  lastname: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a User model
const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel; 
