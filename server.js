//Importing the libaries we are going to use
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Importing our application code using the require function. 
var routes = require('./routes/index');
var config = require('./config');

// This line of code instantiates the Express JS framework. 
var app = express();

// The .use method is similar to the .set method, where it allows us to set further configurations. It is also used to perform chain of actions
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

// catch 404 and forward to error handler.
app.use(function(req, res, next) {

	var err = new Error('Not Found');
  err.status = 404;
  next(err);
  
});

// If our applicatione encounters an error, we'll display the error and stacktrace accordingly.
app.use(function(err, req, res, next) {

  	res.status(err.status || 500);
  
  	return res.json({
        success: false,
        message: '500: Internal Server Error'
    });
});


// We'll choose to have our app listen on port 3000. 
app.listen(3000);