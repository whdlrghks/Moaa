module.exports = function(){
    var conn = require('../config/db')();
    var conn2 = require('../config/db')();
    //google
    var google = require('googleapis');
    var OAuth2 = google.auth.OAuth2;
    var G_CLIENT_ID = '1020724062873-q2905dvpi2rkp2afc5geu3ib136mo21e.apps.googleusercontent.com';
    var G_CLIENT_SECRET =  'wYcSZSLwufXFLAaH7xFi9Rby';
    var G_REDIRECT_URL = "http://localhost:3000/google/callback";
    var oauth2Client = new OAuth2(G_CLIENT_ID, G_CLIENT_SECRET, G_REDIRECT_URL);

    //box
    var BoxSDK = require('box-node-sdk');
    var CLIENT_ID = 'f4tpda8l96cv2cu2kllw2vqzt5pgfyp0';
    var CLIENT_SECRET =  'RehLRXaUytGhBCg3GcFhUs9ReAf0bO35';
    var sdk = new BoxSDK({
      clientID: CLIENT_ID, // required
      clientSecret: CLIENT_SECRET // required
    });

    var route = require('express').Router();
    //받는 주소   /refresh/

    route.get('/box', function(req,res){
      var user_id = req.user._id;
      var search_sql = 'SELECT Baccess,Brefresh FROM user_token WHERE user_id = ? ';
      var update_sql = 'UPDATE user_token SET Baccess = ?,Brefresh=? WHERE user_id=?';
      conn.query(search_sql,user_id, function(err, result){
        if(err){
          console.log(err);
        //이전페이지로 돌아간다.
         res.redirect('/welcome');
        }
        else{
          //DB에서 box 토큰 읽어오기
          var B_accesstoken = result[0].Baccess;
          var B_refreshtoken = result[0].Brefresh;
          //토큰 새로받기
          sdk.getTokensRefreshGrant(B_refreshtoken, function(err, tokenInfo) {
        	   if(err){
               console.log(err);
             //이전페이지로 돌아간다.
              res.redirect('/welcome');
              }
              else{
                var B_new_accesstoken = tokenInfo.accessToken;
                var B_new_refreshtoken = tokenInfo.refreshToken;
                //새로받은 토큰 DB에 저장하기
                conn2.query(update_sql,[B_new_accesstoken,B_new_refreshtoken,user_id], function(err,result){
                  if(err){
                    console.log(err);
                  //이전페이지로 돌아간다.
                   res.redirect('/welcome');
                  }
                  else{
                      //refresh되고 나서의 event
                       res.redirect('/welcome');
                  }
                });
              }
        });
        }
      });

    });

    route.get('/google', function(req, res){
      var user_id = req.user._id;
      var search_sql = 'SELECT Gaccess,Grefresh FROM user_token WHERE user_id = ? ';
      var update_sql = 'UPDATE user_token SET Gaccess = ? WHERE user_id=?';
      conn.query(search_sql,user_id, function(err, result){
        if(err){
          console.log(err);
          //이전페이지로 돌아간다.
           res.redirect('/welcome');
          }
        else{
            //DB에서 현재의 access_token과 refresh_token 읽어와서 credentials에 넣는다.
          var G_accesstoken = result[0].Gaccess;
          var G_refreshtoken = result[0].Grefresh;
          oauth2Client.credentials={
          access_token: G_accesstoken,
          refresh_token: G_refreshtoken
          };
          oauth2Client.refreshAccessToken(function(err, tokens) {
            if(err){console.log(err);
            //이전페이지로 돌아간다.
             res.redirect('/welcome');
            }
            else{
              //그런다음 새로운 토큰을 받는다. 그리고 그 accesstoken을 다시 db에 저장한다.
              var new_G_accesstoken=oauth2Client.credentials.access_token;
              conn2.query(update_sql,[new_G_accesstoken,user_id], function(err, result){
                if(err){
                  console.log(err);
                  //이전페이지로 돌아간다.
                   res.redirect('/welcome');
                }
                else{
                  //refresh되고 나서의 event
                   res.redirect('/welcome');
                }
              })
            }

          });
        }

      })
    });

    return route;





}
