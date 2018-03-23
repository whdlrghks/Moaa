
//Name of the file : dropbox-file-upload.js
//Including the required moduless
var request = require('request');
var fs = require('fs');
var iconv = require('iconv-lite');
var Iconv = require('iconv').Iconv;
var jschardet   = require('jschardet');
//enter your access token
var access_token = "kFb_ENWtmyUAAAAAAAABRhvnb14PfMC6SdiLVRrrVm_1SccCLywMYGZWbTKa8kCc";
//Name of the file to be uploaded
var filename_KR = "1517903510204(M)한이음_MOAA 최종본.mp4.zip";
var pattern = /[^~!@#$%^&*()_+|<>.?:{}a-zA-Z0-9]/gi;
var RegExpHG = "(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/)";
var str = "1517926896091(M)한이음_MOAA 최종본.mp4.zip"
var str2 = str.replace(pattern,"");
console.log(str2);

var content = fs.readFileSync('/Users/ikhwan/dev/js/moaa_dev/Moaa/routes/uploads/dis/1517926896091(M)한이음_MOAA 최종본.mp4.zip');
//write your folder name in place of YOUR_PATH_TO_FOLDER
// For example if the folder name is njera then we can write it in the following way :
// "Dropbox-API-Arg": "{\"path\": \"/njera/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}"
options = {
            method: "POST",
            url: 'https://content.dropboxapi.com/2/files/upload',
            headers: {
              "Content-Type": "application/octet-stream",
              "Authorization": "Bearer " + access_token,
              "Dropbox-API-Arg": "{\"path\": \"/"+str2+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
            },
            body:content
};

request(options,function(err, res,body){
     console.log("Err : " + err);
     console.log("res : " + res);
     console.log("body : " + body);
 })
