var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/dsaas');

var routes = require('./routes/index');
var publisher = require('./routes/publisher');
var demand = require('./routes/demand');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/publisher', publisher);
app.use('/demand', demand);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//mailer

var nodemailer = require('nodemailer');

app.post('/contactres', function (req, res) {
  var mailOpts;
  
	var transporter = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
          user: "jerdebattista@gmail.com",
          pass: "PASSWORD" 
      }
  });
	
  //Mail options
  mailOpts = {
      from: req.body.txtName + " &lt;" + req.body.txtEmail + "&gt;", //grab form data from the request body object
      to: "judieattard@gmail.com",
      subject: "DSAAS contact form",
      text: req.body.Message
  };
  transporter.sendMail(mailOpts, function (error, response) {
      //Email not sent
      if (error) {
          res.render("contactres", {msg: "Error occured, message not sent.", err: true, page: "contact" })
      }
      //Yay!! Email sent
      else {
          res.render("contactres", {msg: 'Message sent! Thank you.', err: false, page: "contact" })
      }
  });
});




module.exports = app;
