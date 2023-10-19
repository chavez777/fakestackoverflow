// Answer Document Schema
const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_date: {
    type: Date,
    default: function () {
      return Date.now();
    }
  },
});

const Model = mongoose.model('Comment', Comment);

module.exports = Model;
