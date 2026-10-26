const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const morgan = require('morgan');

const port = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ROUTES
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })

app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${port}`);
  }
});
