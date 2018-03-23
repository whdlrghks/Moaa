module.exports = function(passport){
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../config/db')();
  var route = require('express').Router();

  route.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/welcome',
        failureRedirect: '/login_error',
        failureFlash: false
      }
    )
  );


  route.post('/register', function(req, res){
     hasher({password:req.body.password}, function(err, pass, salt, hash){
       var user = {
         user_ID:'local:'+req.body.username,
         password:hash,
         username:req.body.displayName,
         salt:salt
       };
       var sql = 'INSERT INTO user_info SET ?';
       conn.query(sql, user, function(err, results){
         if(err){
           console.log(err);
           res.status(500);
         } else {
           req.login(user, function(err){
             req.session.save(function(){
               res.redirect('/welcome');
             });
           });
         }
       });
     });
   }
 );
   route.get('/register', function(req, res){
     res.render('register');
   });
   route.get('/login', function(req, res){
     res.render('login');
   });
   route.get('/logout', function(req, res){
     req.logout();
     //구글 logout 해야된다.
     req.session.save(function(){
       res.redirect('/welcome');
     });
   });
   return route;

}
