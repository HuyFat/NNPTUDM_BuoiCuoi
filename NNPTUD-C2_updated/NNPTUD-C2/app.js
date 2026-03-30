var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')
const messageRoutes = require("./routes/messageRoutes");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
const messageRoutes = require("./routes/messageRoutes");
app.use("/messages", messageRoutes);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.user = { _id: "65f1a1111111111111111111" };
  next();
});
app.use("/messages", messageRoutes);
mongoose.connect('mongodb://localhost:27017/NNPTUD-C2');
mongoose.connection.on('connected', () => {
  console.log("connected");
})

app.use('/api/v1/', require('./routes/index'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/inventories', require('./routes/inventories'));
app.use('/api/v1/carts', require('./routes/carts'));
app.use('/api/v1/upload', require('./routes/upload'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;

