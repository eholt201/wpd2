var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//import dependencies
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const authUtils = require('./utils/auth.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// Checks for error first, if no error, returns client Object which allows us to interact with mongodb database
MongoClient.connect('mongodb://localhost', (err, client) => {
  if (err) {
    throw err;
  }

  //creates database and collection
  const db = client.db('user-profiles');
  const users = db.collection('users');
  app.locals.users = users;
});

//login functionality
passport.use(new Strategy(
  (username, password, done) => {
    // mongo query to search for user in db
    app.locals.users.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      //checks if user exists
      if (!user) {
        return done(null, false);
      }

      //checks if password is correct
      if (user.password != authUtils.hashPassword(password)) {
        return done(null, false);
      }

      //no error, returns user object
      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((is, done) => {
  done(null, { id });
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
