var java = require('java');
var path = require('path');
java.classpath.push(path.resolve(__dirname,'dropbox-core-sdk-3.0.4.jar'));
java.classpath.push(path.resolve(__dirname,'com.fasterxml.jackson.core.jar'));
console.log(__dirname);
java.classpath.push("./");
// java.classpath.push('./java_src/')
var dropBoxAppKey = '1dww360qpj331fz';
var dropBoxAppSecret = 'udjl9iorf8oxomk';
var dropbox_ac_code='kFb_ENWtmyUAAAAAAAABBew-diswMJ4rklZf02kpUMI';
// var getdropboxtoen = java.import("GetDropboxToken");
// var result = getdropboxtoen.authDropbox(dropBoxAppKey,dropBoxAppSecret,dropbox_ac_code);
// console.log(result);
var Locale = java.import("java.util.Locale");
   var dbxAppInfo = java.newInstanceSync("com.dropbox.core.DbxAppInfo",dropBoxAppKey, dropBoxAppSecret);
   //Locale.getDefault().toString() -> 의미 한번더 확인 현재는 ko_KR로 디폹트
		var dbxRequestConfig = java.newInstanceSync("com.dropbox.core.DbxRequestConfig","USER_ID/1.0", "ko_KR");
		var dbxWebAuthNoRedirect = java.newInstanceSync("com.dropbox.core.DbxWebAuthNoRedirect",dbxRequestConfig, dbxAppInfo);

		var dropboxAuthCode = dropbox_ac_code;
    //console.log("123"+dbxWebAuthNoRedirect.finish(dropboxAuthCode));

    dbxWebAuthNoRedirect.finish(dropboxAuthCode, function(err, result) {
       if(err){
         console.log(err);
       }
       else{
        console.log("the result is "+ result)
        var authFinish = result;
        authFinish.getAccessToken(function(err, results){
          var authAccessToken = results;
            console.log(results);
        })

      }
    });
		//var authFinish = dbxWebAuthNoRedirect.finish(dropboxAuthCode);


// 		//수정필요
// 		var authAccessToken = authFinish.getAccessToken();
// console.log(authAccessToken);
//
