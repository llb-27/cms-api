var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // 跨域（新添加）

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var teacherRouter = require('./routes/teacher'); // 老师路由1
var studentRouter = require('./routes/student'); // 学生路由1
var administratorRouter = require('./routes/administrator'); // 管理员路由

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//跨域 （新添加）
app.use(cors({
  origin:['http://localhost:8080'],  //指定接收的地址
  methods:"PUT,POST,GET,DELETE,OPTIONS",
  alloweHeaders:['Content-Type','Authorization']  //指定header
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/teacher', teacherRouter); // 老师路由2
app.use('/student', studentRouter); // 学生路由2
app.use('/administrator', administratorRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
