// Tag Document Schema
const mongoose = require('mongoose');

const Tag = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

Tag.virtual('url').get(function () {
  return '/posts/tag/' + this._id.toString();
});

const Model = mongoose.model('Tag', Tag);
module.exports = Model;