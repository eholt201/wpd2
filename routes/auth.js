const express = require('express');
const router = express.Router();
const authUtils = require('../utils/auth');
const passport = require('passport');

router.get('/login', (req, res, next) => {
  const messages = req.flash();
  res.render('login', { messages });
});

router.post('/login', passport.authenticate('local',
 { failureRedirect: '/auth/login', failureFlash: "Wrong Username or Password" }),
  (req, res, next) => {
    res.redirect('/users');
});

router.get('/register', (req, res, next) => {
  const messages = req.flash();
  res.render('register', { messages });
});

router.post('/register', (req, res, next) => {
  const registrationParams = req.body;
  const users = req.app.locals.users;
  const payload = {
    username: registrationParams.username,
    password: authUtils.hashPassword(registrationParams.password),
    //add empty coursework array so objects can be added
    coursework: [],
  };

  users.insertOne(payload, (err) => {
    //cant get flash messages working for this bit
    if (err) {
      req.flash('error', 'User Already Exists');
    } else {
      req.flash('success', 'Registered Successfully');
    }

    res.redirect('/auth/register');
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
