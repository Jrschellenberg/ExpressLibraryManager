const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const books = require('./routes/books');
const patrons = require('./routes/patrons');
const loans = require('./routes/loans');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/loans', loans);
app.use('/books', books);
app.use('/patrons', patrons);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(err.link){
    res.redirect(err.link+'?errorMessage='+res.locals.message+'&errorStatus='+err.status+'&error='+res.locals.error);
  }
  else{ //Fall back if can't redirect error to same page.
	  res.render('error', { title: "Error", errorMessage: res.locals.message, errorStatus: err.status, error: res.locals.error });
  }
});

module.exports = app;
