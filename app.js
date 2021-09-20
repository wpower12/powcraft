
var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var http         = require('http');
var { Server }   = require("socket.io");

var indexRouter   = require('./routes/index');
var demoRouter    = require('./routes/demos');
var minimogRouter = require('./routes/minimog'); 

var Minimog = require('./src/js/minimog/server/Minimog');

var app    = express();
var server = http.createServer(app);
var io     = new Server(server);

var minimogServer = new Minimog(io, server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/demos', demoRouter);
app.use('/minimog', minimogRouter);


// 404's and Errors
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
