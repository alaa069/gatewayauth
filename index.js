const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes');
const config = require('./config/config');

mongoose.Promise = require('bluebird');
mongoose.connect(config.DataBase)
    .then(() =>  console.log('Connection to DataBase success'))
    .catch((err) => console.error('Connection to DataBase failed'));

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
//app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
//app.all('/api/v1/*', authentication);

app.use('/', userRoutes);

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Start the server
app.set('port', process.env.PORT || config.serverPort);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
