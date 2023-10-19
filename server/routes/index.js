const { Router } = require('express');
const mongoose = require('mongoose');

const router = new Router();

const Tag = mongoose.model('Tag');
const Comment = mongoose.model('Comment');
const Answer = mongoose.model('Answer');
const Question = mongoose.model('Question');

router.get('/questions', async function (req, res) {
  res.json(await Question.find({}).populate('asked_by'));
});

router.get('/tags', async function (req, res) {
  res.json(await Tag.find().populate('created_by'));
});

router.get('/comments', async function (req, res) {
  res.json(await Comment.find().populate('created_by'));
});

router.get('/answers', async function (req, res) {
  res.json(await Answer.find().populate('ans_by'));
});

router.post('/question', async function (req, res) {
  const question = new Question(req.body);
  await question.save();
  res.json(question);
});

router.put('/question', async function (req, res) {
  res.json(await Question.findByIdAndUpdate(req.body._id, req.body));
});

router.post('/comment', async function (req, res) {
  const c = new Comment(req.body);
  await c.save();
  res.json(c);
});

router.post('/answer', async function (req, res) {
  const answer = new Answer(req.body);
  await answer.save();
  res.json(answer);
});

router.put('/answer', async function (req, res) {
  res.json(await Answer.findByIdAndUpdate(req.body._id, req.body));
});

router.post('/tag', async function (req, res) {
  const tag = new Tag(req.body);
  await tag.save();
  res.json(tag);
});

router.put('/tag', async function (req, res) {
  res.json(await Tag.findByIdAndUpdate(req.body._id, req.body));
});

router.delete('/tag/:id', async function (req, res) {
  await Question.updateMany({}, {
    $pullAll: {
      tags: [req.params.id],
    },
  });
  await Tag.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

router.delete('/answer/:id', async function (req, res) {
  await Question.updateMany({}, {
    $pullAll: {
      answers: [req.params.id],
    },
  });
  await Answer.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

router.delete('/question/:id', async function (req, res) {
  await Question.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
