// Question Document Schema
const mongoose = require('mongoose');

const Question = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 100,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  asked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  asked_date_time: {
    type: Date,
    default: function () {
      return Date.now();
    }
  },
  views: {
    type: Number,
    default: function () {
      return 0;
    }
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  votes: [
    {
      value: Number,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ]
});

Question.virtual('url').get(function () {
  return '/posts/question/' + this._id.toString();
});

const Model = mongoose.model('Question', Question);

module.exports = Model;
