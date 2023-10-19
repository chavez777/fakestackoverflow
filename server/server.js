// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');

require('./models/user');
require('./models/comment');
require('./models/tags');
require('./models/answers');
require('./models/questions');
const app = express();

app.use(session({ secret: 'keyboard cat', cookie: {} }));
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/posts', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// connect db
mongoose.connect('mongodb://localhost:27017/fake_so', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

process.on('SIGINT', async () => {
  db.close();
  console.info('Server closed. Database instance disconnected');
  process.exit(0);
});

db.on('error', function (err) {
  console.error(err);
});

db.once('open', async function () {
  // api routes and pages
  app.listen(8000, () => {
    console.log('app started at port 8000.');
  });
});
