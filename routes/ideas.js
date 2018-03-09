/*jshint esversion: 6 */

const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {ensureAuthenticated} = require('../helpers/auth');

/// Load Models
require('../models/Idea')
const Idea = mongoose.model('ideas')

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
  .sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  })
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id) {
      req.flash('error_msg', 'Not yours');
      res.redirect('/ideas')
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
  });
});

router.post('/', ensureAuthenticated, (req, res) => {
  console.log(req.body);
  let errors = [];

  if(!req.body.title){
    alert('hey')
    errors.push({text:'Error Title'});
  }

  if(!req.body.details){
    errors.push({text:'Error Details'});
  }

  if(errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
    .save()
    .then(idea => {
      req.flash('success_msg', 'created')
      res.redirect('/ideas')
    })
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
      .then(idea => {
        req.flash('success_msg', 'updated')
        res.redirect('/ideas');
      })
  });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(() => {
    req.flash('success_msg', 'moved')
    res.redirect('/ideas')
  })
})

module.exports = router;