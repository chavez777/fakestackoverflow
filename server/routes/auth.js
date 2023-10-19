const mongoose = require('mongoose');
const User = mongoose.model('User');
const express = require('express');
const bcrypt = require('bcrypt');

const router = new express.Router();

router.post('/register', async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    res.sendStatus(406);
    return;
  }

  // create user model by post body
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const user = new User(req.body);
  // save
  user.save()
    .then(doc => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      if (err.code === 11000) {
        res.sendStatus(406);
      } else {
        res.sendStatus(500);
      }
    });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }).lean()
    .then(doc => {
      if (doc) {
        bcrypt.compare(req.body.password, doc.password, function (err, valid) {
          if (valid) {
            req.session.user = doc;
            res.sendStatus(200);
          } else {
            res.sendStatus(401);
          }
        });
      } else {
        res.sendStatus(401);
      }
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.sendStatus(200);
});

router.get('/current', async (req, res) => {
  if (!req.session.user) {
    res.json(null);
    return;
  }
  res.json(await User.findById(req.session.user._id));
});

router.put('/user', async function (req, res) {
  await User.findByIdAndUpdate(req.body._id, {
    $inc: { score: req.body.score }
  });
  res.sendStatus(200);
});

module.exports = router;
