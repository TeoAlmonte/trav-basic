/*jshint esversion: 6 */
// Modules
const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const passport = require('passport');
const db = require('./config/database');
/// Initialize Modules - Middleware

// Passports
require('./config/passport')(passport);

// Express
const app = express();

// Mongoose
// local mongodb://localhost/dev-sample
// remote mongodb://teoalmonte:password@ds231588.mlab.com:31588/database_gen
mongoose.connect(db.mongoURI, {

})
  .then(() => console.log(`Mongo Connected...${db.mongoURI}`))
  .catch(err => console.log(err));

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override
app.use(methodOverride('_method'));

// Sessions
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

/// Use Modules

// Load View Engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// Global variables for Flash
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Routes
app.get('/', (req, res) => {
  const titleVar = "server in";
  res.render('index', {
    title: titleVar
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/ideas', ideas)
app.use('/users', users)



// Run Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started on ${port}`)
})