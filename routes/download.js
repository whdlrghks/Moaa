module.exports = function(){
  var conn = require('../config/db')();
  var route = require('express').Router();
  var java = require('java');
  var path = require('path');
  var async = require('async');
  var fs = require('fs');
  var mime = require('mime');
  var http = require('https');
  var BoxSDK = require('box-node-sdk');
  var B_CLIENT_ID = 'f4tpda8l96cv2cu2kllw2vqzt5pgfyp0';
  var B_CLIENT_SECRET =  'RehLRXaUytGhBCg3GcFhUs9ReAf0bO35';
  var sdk = new BoxSDK({
    clientID: B_CLIENT_ID, // required
    clientSecret: B_CLIENT_SECRET // required
  });

  var Dropbox = require('dropbox');

  var path = require('path');
  var google = require('googleapis');
  var OAuth2 = google.auth.OAuth2;
  var CLIENT_ID = '1020724062873-q2905dvpi2rkp2afc5geu3ib136mo21e.apps.googleusercontent.com';
  var CLIENT_SECRET =  'wYcSZSLwufXFLAaH7xFi9Rby';
  var REDIRECT_URL = "http://localhost:3000/google/callback";
  var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  java.classpath.push(path.resolve(__dirname+"/java/",'zip4j-1.3.2.jar'));
  java.classpath.push("./");

  var drive;
  // var dbx;
  var client;
  var Bfolder;
  var Glist;
  var Blist;
  var Dlist;
  var zippath;
  var totalpath;
  var commonname='';

  var db_data = function(user_id, file_id, req, res){
    //각각 드라이브 DB에서 액세스 토큰 및 파일 리스트 읽어오기

    var search_sql = 'select file_ID,Gaccess,Grefresh,Daccess,Baccess,Bfolder,Gpath,Bpath,Dpath,filename from user_token join File_info on user_token.user_ID = File_info.user_ID where File_info.user_ID=? and File_info.file_ID= ?';
    conn.query(search_sql,[user_id,file_id],
      function(err, result){
        if(err){
          console.log(err);
          //이전페이지로 돌아간다.
          res.redirect('/welcome');
        }
        else{

          var G_accesstoken = result[0].Gaccess;
          var G_refreshtoken = result[0].Grefresh;
          var B_accesstoken = result[0].Baccess;
          Bfolder=result[0].Bfolder;
          var D_accesstoken = result[0].Daccess;
          Glist = result[0].Gpath.toString().split(",");
          Blist = result[0].Bpath.toString().split(",");
          Dlist = result[0].Dpath.toString().split(",");
          commonname = result[0].filename;

          if(G_accesstoken){
          //google drive 연결
          oauth2Client.credentials={
              access_token: G_accesstoken,
              refresh_token: G_refreshtoken
              };
           drive = google.drive({ version: 'v3', auth: oauth2Client });

         }

         //dropbox에 연결
         if(D_accesstoken){
           var dbx = new Dropbox({ accessToken: D_accesstoken});
          }
          //box에 연결
          if(B_accesstoken){
           client = sdk.getBasicClient(B_accesstoken);
         }

         async.parallel([
           //google 다운로드
             function Google(callback_org){

               if(Glist.length>0&&Glist[0]!=''){
                 async.map(Glist,
                         function(fileid, callback){
                               drive.files.get({
                                fileId: fileid
                              }, (err, metadata) => {
                                if (err) {
                                  throw err;
                                }
                                console.log('Downloading %s...', metadata.name);
                                var downpath_google=__dirname+'/downloads/dis/'+metadata.name;
                                const dest = fs.createWriteStream(downpath_google);

                                drive.files.get({
                                  fileId: fileid,
                                  alt: 'media'
                                })
                                  .on('error', err => {
                                    console.error('Error downloading file');
                                    throw err;
                                  })
                                  .pipe(dest);

                                dest
                                  .on('finish', () => {
                                    console.log('Downloaded %s!', metadata.name);
                                    //파일이 메인 zip파일인지 확인
                                    totalpath=totalpath+",M,"+downpath_google;
                                    var searchname_google = metadata.name.split(".")

                                    if(searchname_google[searchname_google.length-1]=='zip'){

                                      callback(null,downpath_google);

                                    }
                                    else{

                                      callback(null,'');

                                    }


                                  })
                                  .on('error', err => {
                                    console.error('Error writing file!');
                                    callback(err,'');
                                    throw err;
                                  });
                              });

                         },
                         function(err,result_google){
                             if(err) console.log(err);
                             //다운로드 완료
                               if(result_google==''){
                                 console.log("Google sends callback_org");
                                 callback_org(null, "Google Completed");

                               }
                               else{
                                 zippath=result_google;
                                 console.log("Google zip is :"+result_google);
                                 callback_org(null, "Google Completed with zip")
                               }

                         }
                       );
               }
               else{
                 console.log("Google sends callback_org3");
                 callback_org(null, "No file downloaded to Google");}

             },
             //box 다운로드
             function Box(callback_org){

               if(Blist.length>0&&Blist[0]!=''){
                 //
                 async.map(Blist,
                         function(fileid, callback){
                           //
                           client.files.get(fileid, null, function(err, newfile){
                             if(err){
                               console.log(err);
                             }
                             else {
                               //
                               var filename_box = newfile.name;
                            client.files.getDownloadURL(fileid, null, function(error, downloadURL) {

                                        if (error) {
                                          console.log(error);
                                        //handle error
                                      }

                                      var downpath_box = __dirname+'/downloads/dis/'+filename_box;
                                      var output = fs.createWriteStream(downpath_box);
                                      console.log("Box Downloading " + filename_box);

                                        var request = http.get(downloadURL, function(response) {

                                    response.pipe(output)
                                      .on('finish',() => {
                                         console.log("Box Downloaded " + filename_box);
                                         //파일이 메인 zip파일인지 확인
                                         totalpath=totalpath+",M,"+downpath_box;
                                         var searchname_box = filename_box.split(".");

                                         if(searchname_box[searchname_box.length-1]=='zip'){

                                           callback(null,downpath_box);
                                         }
                                         else{
                                           callback(null,'');
                                         }
                                       })
                                       .on('error', err => {
                                         console.error('Error writing file!');
                                         callback(err,null);
                                         throw err;
                                       });

                                  });
                              //process the downloadURL
                            });
                               // var filename_box = newfile.name;
                               // client.files.getReadStream(fileid, null, function(error, stream) {
                               //
                               //   if (error) {
                               //     // handle error
                               //     console.log(error);
                               //   }
                               //    console.log("Box Downloading " +filename_box);
                               //   var downpath_box = __dirname+'/downloads/dis/'+filename_box;
                               //   // write the file to disk
                               //
                               //   const output = fs.createWriteStream(downpath_box);
                               //
                               //   stream.pipe(output);
                               //   output
                               //   .on('finish',() => {
                               //
                               //      console.log("Box Downloaded " + filename_box);
                               //      //파일이 메인 zip파일인지 확인
                               //      totalpath=totalpath+downpath_box;
                               //      var searchname_box = filename_box.split(".");
                               //
                               //      if(searchname_box[searchname_box.length-1]=='zip'){
                               //
                               //        callback(null,downpath_box);
                               //      }
                               //      else{
                               //        callback(null,'');
                               //      }
                               //    })
                               //    .on('error', err => {
                               //      console.error('Error writing file!');
                               //      callback(err,null);
                               //      throw err;
                               //    });
                               //   //stream으로 다운로드 될때까지 기다린다.
                               // });
                             }
                           });

                         },
                         function(err,result_box){
                             if(err) {
                               console.log(err);}

                             //다운로드 완료
                             else {
                               if(result_box==''){
                                 console.log("Box : "+result_box);
                                 callback_org(null, "Box Completed");
                               }
                               else{
                                 zippath=result_box;
                                 console.log("Box with zip :" +result_box);
                                callback_org(null, "Box Completed with zip");
                               }


                             }
                         }
                       );
               }
               else{callback_org(null, "No file downloaded to Box");
             }
             },
             //dropbox 다운로드
             function Dropbox(callback_org){

               if(Dlist.length>0&&Dlist[0]!=''){
                 async.map(Dlist,
                         function(filename, callback){
                           var dropdownpath;
                          //여기 까지 가능
                          var timestamp = filename.split('(M)')[0];
                          var filesep=filename.substring(filename.length-4,filename.length);
                          var savefilename = timestamp+"(M)"+commonname+filesep;
                          console.log("Dropbox name is " + savefilename);
                          var url = dbx.filesGetTemporaryLink({path: '/' + filename});
                          url.then(function(result){
                            dropdownpath=__dirname+'/downloads/dis/'+savefilename;
                            //console.log(result);
                            console.log("URL : "+result.link);
                            var output = fs.createWriteStream(dropdownpath);
                              var request = http.get(result.link, function(response) {
                          response.pipe(output)
                          .on('finish',() => {
                            totalpath=totalpath+",M,"+dropdownpath;
                            //파일이 메인 zip파일인지 확인

                            var searchname = filename.split(".")
                            if(searchname[searchname.length-1]=='zip'){
                              console.log("Completed download from dropbox : "+filename);
                              callback(null,dropdownpath);
                            }
                            else{
                              console.log("Completed download from dropbox : "+filename);
                              callback(null,'');
                            }
                             })
                             .on('error', err => {
                               console.error('Error writing file!');
                               callback(err,null);
                               throw err;
                             });;
                          });
                          });

                         },
                         function(err,result_dropbox){
                             if(err) console.log(err);
                             //업로드 완료
                             else {
                               if(result_dropbox==''){
                                 console.log("Dropbox : "+result_dropbox);
                                 callback_org(null, "Dropbox Completed");
                               }
                               else{
                                 zippath=result_dropbox;
                                 console.log("Dropbox with zip : "+result_dropbox);
                                callback_org(null, "Dropbox Completed with zip");
                               }
                             }
                         }
                       );
               }
               else{callback_org(null, "No file downloaded to dropbox");}
             }
           ],
             function(err,results){          // Callback함수(기존 작업이 모두 종료되어야만 호출된다.)
                 if(err){
                     console.log("Parallel error is"+err);
                 }
                 console.log('Result 1 ----');
                 console.log(results[0]);
                 console.log('Result 2 ----');
                 console.log(results[1]);
                 console.log('Result 3 ----');
                 console.log(results[2]);
                 console.log("zippath:"+zippath);
                //이제 분할된거 합치기.

                unzip_zip4j(zippath,req, res);



                });
              }
        });
};

var unzip_zip4j = function(zippath,req, res){

  var file = java.newInstanceSync("java.io.File",zippath.toString());

  var zipFile = java.newInstanceSync("net.lingala.zip4j.core.ZipFile",file.getAbsolutePathSync());

  zipFile.extractAll(__dirname+"/downloads/org/", function(err,result){
    if(err) console.log(err);
    else{
        console.log("Complete unzip : "+zippath);
        var patharr = totalpath.split(",M,");
        //파일 최종 이름 가져오기
        var separatedfile =  patharr[1].split("/");
        var filename=separatedfile[separatedfile.length-1];
        var timestamp = filename.split('(M)')[0];
        var orgfilename = timestamp+"(M)"+commonname;
        async.map(patharr,
                function(path, callback){
                  //원본파일삭제 patharr[0]은 undefine이라서 예외처리
                  if(path!=patharr[0]){
                    fs.unlink(path, function(err){
                      if(err)throw err;

                      console.log('Successfully deleted downloaded file -> '+path);


                    });
                  }
                  callback(null, "finish");
                },
                function(err,result){
                    if(err) console.log(err);
                    //다운로드 완료
                    else {
                      var orgdir=__dirname+"/downloads/org/"+orgfilename;
                      console.log("original file path is " + orgdir);

                      sendfile(orgdir,orgfilename,req, res);

                    }
                }
              );

    }
  });
};

var sendfile = function(orgdir,orgfilename,req, res){

  var file = orgdir;
  //원본파일삭제
  res.download(file,function(){
    fs.unlink(file);

  });


}




  route.post('/', function(req, res){
        //console.log(req.file);

        db_data(req.user._id, req.body.name,req, res);

      }
    );

  return route;
}
