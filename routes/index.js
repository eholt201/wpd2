var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const users = req.app.locals.users;
  
  res.render('index');
});

module.exports = router;
