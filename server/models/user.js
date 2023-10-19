// Answer Document Schema
const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: 'Email already exists',
  },
  password: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  created_date: {
    type: Date,
    default: function () {
      return Date.now();
    }
  },
});

const Model = mongoose.model('User', User);

module.exports = Model;
