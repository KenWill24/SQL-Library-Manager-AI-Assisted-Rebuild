// Creating data
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');
var patronsRouter = require('./routes/patrons');

var app = express();

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books' , booksRouter);
app.use('/patrons' , patronsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // Create a new Error(
  const err = new Error();
  // Set status to 404              
  err.status = 404;   
  // User-friendly message                  
  err.message = 'Page Not Found';
  // Pass to global error handler       
  next(err);
                            
});

// global error handler
app.use((err, req, res, next) => {
  // Default to 500
  err.status = err.status || 500;
  // Default message                     
  err.message = err.message || 'Internal Server Error'; 

  console.log(`Error Status: ${err.status}`);
  console.log(`Error Message: ${err.message}`);

  res.status(err.status);
  // Pass {err} to the error template
  res.render('error', { err });
});

module.exports = app;