module.exports = function(){

  var conn = require('../config/db')();
  var conn2 = require('../config/db')();
  var route = require('express').Router();

  var java = require('java');
  var path = require('path');
  java.classpath.push(path.resolve(__dirname+"/jar",'dropbox-core-sdk-3.0.4.jar'));
  java.classpath.push(path.resolve(__dirname+"/jar",'com.fasterxml.jackson.core.jar'));
  java.classpath.push("./");
  var dropBoxAppKey = '1dww360qpj331fz';
  var dropBoxAppSecret = 'udjl9iorf8oxomk';

  route.post(
    '/callback',
    function(req, res){
      var dropbox_ac_code=req.body.dropbox_ac_code;

      var Locale = java.import("java.util.Locale");
      var dbxAppInfo = java.newInstanceSync("com.dropbox.core.DbxAppInfo",dropBoxAppKey, dropBoxAppSecret);
     //Locale.getDefault().toString() -> 의미 한번더 확인 현재는 ko_KR로 디폹트
      var dbxRequestConfig = java.newInstanceSync("com.dropbox.core.DbxRequestConfig","USER_ID/1.0", "ko_KR");
      var dbxWebAuthNoRedirect = java.newInstanceSync("com.dropbox.core.DbxWebAuthNoRedirect",dbxRequestConfig, dbxAppInfo);
      var authAccessToken ="";
      var dropboxAuthCode = dropbox_ac_code;
          //console.log("123"+dbxWebAuthNoRedirect.finish(dropboxAuthCode));
      dbxWebAuthNoRedirect.finish(dropboxAuthCode, function(err, result) {
             if(err){
               //에러뜨면 다시 돌려야한다.
               res.redirect('/auth_token/dropboxindex');
               console.log(err);
             }
             else{
              console.log("the result is "+ result)
              var authFinish = result;
                  authFinish.getAccessToken(function(err, results){
                    if(err){
                      //에러뜨면 다시 돌려야한다.
                      res.redirect('/auth_token/dropboxindex');
                      console.log(err);
                    }
                    else{
                          var authAccessToken = results;
                          var refreshToken="";
                            console.log(results);
                            //DB 저장하기
                            var user_token = {
                              user_ID: req.user._id,
                              Gaccess: null,
                              Grefresh: null,
                              Daccess : authAccessToken,
                              Drefresh : null,
                              Baccess : null,
                              Brefresh : null,
                              Bfolder : null
                            };
                            var up_access_token=authAccessToken;
                            var up_user_id=req.user._id;
                            var sql = 'INSERT INTO user_token SET ?';
                            var upsql = 'UPDATE user_token SET Daccess = ? WHERE user_ID=?'
                            //먼저 기존에 연동된 토큰이 없다고 가정하고 추가
                            conn.query(sql, user_token, function(err, results){
                                  if(err){
                                    console.log("Insert error "+ user_token + "'s" + err);

                                  } else {
                                    //제대로 저장 되었는지 확인
                                    res.render('result', {
                                          Name : req.user.username,
                                          accesstoken : accessToken,
                                          refreshtoken : refreshToken
                                          });
                                  }
                            });
                            //만일 기존에 연동된 토큰이 있다면 UPDATE 실행
                            conn2.query(upsql,[up_access_token,up_user_id],function(err, results){
                              if(err){
                                console.log("Update error "+ up_user_id + "'s" + err);
                                res.redirect('/auth_token/dropboxindex');
                              }
                              else{
                                res.render('result', {
                                      Name : req.user.username,
                                      accesstoken : up_access_token,
                                      refreshtoken : refreshToken
                                      })
                              }
                            });
                      }


                    });

                  //finish
                  }
                  });
  });
return route;
}
