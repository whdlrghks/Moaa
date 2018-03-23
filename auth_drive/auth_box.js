module.exports = function(){
  var BoxSDK = require('box-node-sdk');


  var conn = require('../config/db')();
  var route = require('express').Router();

  var CLIENT_ID = 'f4tpda8l96cv2cu2kllw2vqzt5pgfyp0';
  var CLIENT_SECRET =  'RehLRXaUytGhBCg3GcFhUs9ReAf0bO35';
  var sdk = new BoxSDK({
    clientID: CLIENT_ID, // required
    clientSecret: CLIENT_SECRET // required
  });
  route.get(
    '/callback',
    function(req, res){

      var code = req.query.code;
      sdk.getTokensAuthorizationCodeGrant(code,null, function(error, tokens) {
          if (error) {
            res.send("token error is "+ error);
          }
          else{
          var accessToken = tokens.accessToken
          var refreshToken = tokens.refreshToken
          console.log('The ID From DB ' + req.user._id);
          console.log('The accessToken : ' + accessToken);
          console.log('The refreshToken : ' + refreshToken);
          var client = sdk.getBasicClient(accessToken);
          var folder_name="MOAA";
          var folder_id='';
          client.folders.create('0',folder_name,function(err, newFolder){
            if(err) {
              console.log(err);
                client.folders.create('0',folder_name+"2",function(err, newFolder2){
                    if(err) {
                    console.log(err);}
                    else{

                      folder_id=newFolder2.id;
                      console.log('The Box folder : '+folder_id);
                      //DB 저장하기
                      console.log("the box folder value is " + folder_id);
                      var user_token = {
                        user_ID: req.user._id,
                        Gaccess: null,
                        Grefresh: null,
                        Daccess : null,
                        Drefresh : null,
                        Baccess : accessToken,
                        Brefresh : refreshToken,
                        Bfolder : folder_id
                      };
                      //INSERT 체크
                      var user_id= req.user._id;
                      var user_access= accessToken;
                      var user_refresh= refreshToken;
                      var user_folder =folder_id;
                      var sql = 'INSERT INTO user_token SET ?';
                      var upsql = 'UPDATE user_token SET Baccess = ?, Brefresh=?, Bfolder =? WHERE user_ID=?'
                      conn.query(sql, user_token, function(err, results){
                        if(err){
                          console.log("Insert error "+ user_id + "'s" + err);

                        } else {
                          res.render('result', {
                                Name : req.user.username,
                                accesstoken : user_access,
                                refreshtoken : user_refresh
                                });
                        }
                      });
                      //만일 기존에 연동된 토큰이 있다면 UPDATE 실행
                      conn.query(upsql,[user_access,user_refresh,user_folder,user_id],function(err, results){
                        if(err){
                          console.log("Update error "+ user_id + "'s" + err);
                          res.redirect('/auth_token/boxindex');
                        }
                        else{
                          res.render('result', {
                                Name : req.user.username,
                                accesstoken : user_access,
                                refreshtoken : user_refresh
                                })
                        }
                      });
                    }
                });
            }
            else{
              folder_id=newFolder.id;
              console.log('The Box folder : '+folder_id);
              //DB 저장하기
              console.log("the box folder value is " + folder_id);
              var user_token = {
                user_ID: req.user._id,
                Gaccess: null,
                Grefresh: null,
                Daccess : null,
                Drefresh : null,
                Baccess : accessToken,
                Brefresh : refreshToken,
                Bfolder : folder_id
              };
              //INSERT 체크
              var user_id= req.user._id;
              var user_access= accessToken;
              var user_refresh= refreshToken;
              var user_folder =folder_id;
              var sql = 'INSERT INTO user_token SET ?';
              var upsql = 'UPDATE user_token SET Baccess = ?, Brefresh=?, Bfolder =? WHERE user_ID=?'
              conn.query(sql, user_token, function(err, results){
                if(err){
                  console.log("Insert error "+ user_id + "'s" + err);

                } else {
                  res.render('result', {
                        Name : req.user.username,
                        accesstoken : user_access,
                        refreshtoken : user_refresh
                        });
                }
              });
              //만일 기존에 연동된 토큰이 있다면 UPDATE 실행
              conn.query(upsql,[user_access,user_refresh,user_folder,user_id],function(err, results){
                if(err){
                  console.log("Update error "+ user_id + "'s" + err);
                  res.redirect('/auth_token/boxindex');
                }
                else{
                  res.render('result', {
                        Name : req.user.username,
                        accesstoken : user_access,
                        refreshtoken : user_refresh
                        })
                }
              });


            }
          });


          }
      });
    }
  )
return route;
}
