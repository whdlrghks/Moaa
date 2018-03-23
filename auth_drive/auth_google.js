module.exports = function(){
  var google = require('googleapis');
  var conn = require('../config/db')();
  var conn2 = require('../config/db')();
  var route = require('express').Router();
  var OAuth2 = google.auth.OAuth2;
  var CLIENT_ID = '1020724062873-q2905dvpi2rkp2afc5geu3ib136mo21e.apps.googleusercontent.com';
  var CLIENT_SECRET =  'wYcSZSLwufXFLAaH7xFi9Rby';
  var REDIRECT_URL = "http://localhost:3000/google/callback";
  var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


  var scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
  });
  // generate a url that asks permissions for Google+ and Google Calendar scopes
  //google accesstoken/ refreshtoken 얻기

  route.get(
    '/callback',
    function(req, res){

      var code = req.query.code;
      oauth2Client.getToken(code, function(error, tokens) {
          if (error) {res.send(error)};
          var accessToken = tokens.access_token
          var refreshToken = tokens.refresh_token
          console.log('The ID From DB ' + req.user._id);

          //DB 저장하기
          var user_token = {
            user_ID: req.user._id,
            Gaccess: accessToken,
            Grefresh: refreshToken,
            Daccess : null,
            Drefresh : null,
            Baccess : null,
            Brefresh : null
          };
          //INSERT 체크
          var user_id= req.user._id;
          var user_access= accessToken;
          var user_refresh= refreshToken;
          var sql = 'INSERT INTO user_token SET ?';
          var upsql = 'UPDATE user_token SET Gaccess = ?, Grefresh=? WHERE user_ID=?'
          conn.query(sql, user_token, function(err, results){
            if(err){
              console.log("Insert error "+ user_id + "'s" + err);
              //만일 기존에 연동된 토큰이 있다면 UPDATE 실행
              conn2.query(upsql,[user_access,user_refresh,user_id],function(err, results){
                if(err){
                  console.log("Update error "+ user_id + "'s" + err);
                  res.redirect('/auth_token/googleindex');
                }
                else{
                  res.render('result', {
                        Name : req.user.username,
                        accesstoken : user_access,
                        refreshtoken : user_refresh
                        })
                }
              });
            } else {
              res.render('result', {
                    Name : req.user.username,
                    accesstoken : accessToken,
                    refreshtoken : refreshToken
                    });
            }
          });


      });
    }
  )
return route;
}
