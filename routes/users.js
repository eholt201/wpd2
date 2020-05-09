var express = require('express');
var router = express.Router();

//mongodb helper function that takes String representation and turns into Object so
//mongo can use it to find user
const ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('auth/login');
  }

  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id  }, (err, results) => {
    if (err) {
      throw err;
    }

    res.render('account', { ...results });
  })
});

router.get('/:username', (req, res, next) => {
  const users = req.app.locals.users;
  const username = req.params.username;
  const coursework = req.params.coursework;

  users.findOne({ username }, (err, results) => {
    if (err || !results) {
      res.render('public-profile', { messages: { error: ['User not found']}});
    }
    //console.log(results.coursework[0].module_name);
    const coursework = results.coursework;
    //console.log(coursework)
    //console.log(coursework[0].milestones)
    res.render('public-profile', { ...results, username, coursework});
  });
});

router.post('/', (req, res, next) => {
  if (!req. isAuthenticated()) {
    res.redirect('auth/login');
  }

  const users = req.app.locals.users;
  const { module_name, module_code, coursework_title, due_date } = req.body;
  const coursework = req.body;
  coursework.milestones = [{
    milestone_date: "02/02",
    milestone_description: "This is a milestone description",
  }];
  const _id = ObjectID(req.session.passport.user);

  users.updateOne({ _id }, { $push: { coursework } },
    (err) => {
      if (err) {
        req.flash('error', 'Error');
      } else {
        req.flash('success', 'Coursework Added');
      }

  res.redirect('/users');
  });
})

router.get('/:username/:coursework_title', (req, res) => {
  const users = req.app.locals.users;
  const username = req.params.username;
  const coursework = req.params.coursework;
  const coursework_title = req.params.coursework_title;


  users.aggregate([
    {$match: {'coursework.coursework_title': coursework_title}},
    {$project: {
      coursework: {$filter: {
        input: '$coursework',
        as: 'coursework',
        cond: {$eq: ['$$coursework.coursework_title', coursework_title]}
      }},
      _id: 0
    }}
  ])
  .toArray()
  .then((results) => {
    let result = results[0].coursework[0]
    res.render('public-coursework', { username, result });
  })
});

router.get('/delete/:username/:coursework_title', (req, res) => {
  const users = req.app.locals.users;
  const username = req.params.username;
  const coursework_title = req.params.coursework_title;
  console.log("hello")

  users.updateOne({username: username}, {
    "$pull": {
      "coursework": {
        "coursework_title": coursework_title
      }
    }
  })
  res.redirect('/users/'+username);
});

module.exports = router;
