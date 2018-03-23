module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');
 
  var app = express();
  app.set('views', './view');           // New!!
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: '19q0iojd0129ijrol!',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
      host:'localhost',
      port:3306,
      user:'root',
      password:'1234',
      database:'moaa_dev'
    })
  }));

  return app;
}
