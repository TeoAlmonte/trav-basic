const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

// User Model
require('../models/User')
const User = mongoose.model('users')

// Login
router.get('/login', (req, res) => {
  res.render('users/login')
})

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/register', (req, res) => {
  let errors = []

  if (req.body.password != req.body.passwordconfirm) {
    errors.push({
      text: 'pass err no match'
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: 'pass 2 short'
    });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordconfirm: req.body.passwordconfirm
    });
  } else {
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email taken')
          res.redirect('/users/register')
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'registerd nice')
                  res.redirect('/users/login')
                })
                .catch(err => {
                  console.log(err)
                  return
                })
            })
          })
        }
      })
  }
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login')
})

module.exports = router;