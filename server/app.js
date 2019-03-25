var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const TOKEN = '6i2nSgWu0DfYIE8I0ZBJOtxTmHJATRzu';

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(function (req, res, next) {
  //if (['/collect'].indexOf(req.path) > -1) {
  //  next();
  //  return true;
  //}
  //if (req.headers.token &&
  //  req.headers.token === TOKEN)
  //  next();
  //else
  //  res.status(401).json('Access denied');
//});
app.use('/', indexRouter);

module.exports = app;
