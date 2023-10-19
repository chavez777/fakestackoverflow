// Answer Document Schema
const mongoose = require('mongoose');

const Answer = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  ans_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ans_date_time: {
    type: Date,
    default: function () {
      return Date.now();
    }
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  votes: [
    {
      value: Number,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ]
});

Answer.virtual('url').get(function () {
  return '/posts/answer/' + this._id.toString();
});

const Model = mongoose.model('Answer', Answer);

module.exports = Model;
