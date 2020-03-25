const express = require('express');
const router = express.Router();
const authUtils = require('../utils/auth');
const passport = require('passport');

router.get('/login', (req, res, next) => {
  const messages = req.flash();
  res.render('login', { messages });
});

router.post('/login', passport.authenticate('local',
 { failureReditect: '/auth/login', failureFlash: "Wrong Username or Password" })
  (req, res, next) => {
    res.redirect('/users');
})
