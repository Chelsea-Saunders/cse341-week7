require('dotenv').config();
const path = require('path');
const express = require('express');
const mongodb = require('./db/connect');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const morgan = require('morgan');
const MongoStore = require('connect-mongo');
const { formatDate, truncate, stripTags, editIcon } = require('./helpers/ejs');

//passport config
require('./db/passport')(passport);

const port = process.env.PORT || 8080;
const app = express();

// sessions
app.use(session({
  secret: 'keyboard cat', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI
  })
}));

app.use(passport.initialize());
app.use(passport.session())

// set global variables
app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.formatDate = formatDate;
  res.locals.truncate = truncate;
  res.locals.stripTags = stripTags;
  res.locals.editIcon = editIcon;
  next();
});

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method
    return method
  }
}));

// ROUTES
app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
        app.listen(port);
        console.log(`Server running on ${process.env.NODE_ENV} mode on port ${port}`)
      })
      .catch((mongooseErr) => console.log('Mongoose connection error:', mongooseErr));
    }
});
