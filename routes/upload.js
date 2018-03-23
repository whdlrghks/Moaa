module.exports = function(){
  var conn = require('../config/db')()
  , route = require('express').Router()
  , java = require('java')
  , path = require('path')
  , async = require('async')
  , fs = require('fs')
  , mime = require('mime')
  , request = require('request')
  , BoxSDK = require('box-node-sdk')
  , B_CLIENT_ID = 'f4tpda8l96cv2cu2kllw2vqzt5pgfyp0'
  , B_CLIENT_SECRET =  'RehLRXaUytGhBCg3GcFhUs9ReAf0bO35'
  , sdk = new BoxSDK({
    clientID: B_CLIENT_ID, // required
    clientSecret: B_CLIENT_SECRET // required
  })
  , Dropbox = require('dropbox')
  , path = require('path')
  , google = require('googleapis')
  , OAuth2 = google.auth.OAuth2
  , CLIENT_ID = '1020724062873-q2905dvpi2rkp2afc5geu3ib136mo21e.apps.googleusercontent.com'
  , CLIENT_SECRET =  'wYcSZSLwufXFLAaH7xFi9Rby'
  , REDIRECT_URL = "http://localhost:3000/google/callback"
  , oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  java.classpath.push(path.resolve(__dirname+"/java",'zip4j-1.3.2.jar'));
  java.classpath.push("./");
  var present_date
  , multer = require('multer')
  , storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploads/org/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      present = new Date();
      cb(null, present.getTime()+'(M)'+file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
  })
  ,upload = multer({ storage: storage })
  ,Gdrive
  ,Gdrive_upload
  ,dbx
  ,client
  ,Bfolder
  ,D_accesstoken;

  //사용가능한 드라이브 사이즈 얻어오기
  var db_data = function(user_id, req, res){
    //각각 드라이브 DB에서 액세스 토큰 읽어오기
    var search_sql = 'SELECT Gaccess,Grefresh,Daccess,Baccess,Bfolder FROM user_token WHERE user_id = ? ';
    conn.query(search_sql,user_id, function(err, result){
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
          D_accesstoken = result[0].Daccess;
          if(G_accesstoken){
          //google drive 연결
          oauth2Client.credentials={
              access_token: G_accesstoken,
              refresh_token: G_refreshtoken
              };
           Gdrive = google.drive({ version: 'v2', auth: oauth2Client });
           Gdrive_upload = google.drive({ version: 'v3', auth: oauth2Client });
         }

         if(D_accesstoken){
           dbx = new Dropbox({ accessToken: D_accesstoken});
          }
          if(B_accesstoken){
           client = sdk.getBasicClient(B_accesstoken);
         }
          var size = [];

                  async.waterfall([
                      function(callback){
                        //google size
                          if(err) {
                            callback(null, size);
                            console.log(err);
                              }
                          if(!G_accesstoken) {
                            callback(null, size);
                            console.log("No Google Token by"+user_id);
                          }
                            Gdrive.about.get(function(req, res){
                              console.log('Google used : '+ res.quotaBytesUsed);
                              console.log('Google Total : '+ res.quotaBytesTotal);
                              size.push("G:"+parseInt(res.quotaBytesTotal-res.quotaBytesUsed));

                              callback(null,size );
                            });




                      },
                      function(size, callback){
                        //dropbox size
                        if(err) {
                          callback(null, size);
                          console.log(err);
                            }
                          if(!D_accesstoken) {
                              callback(null, size);
                              console.log("No Dropbox Token by"+user_id);
                            }
                          dbx.usersGetSpaceUsage()
                                    .then(function(response) {
                                    console.log('Drop used :' + response.used);
                                    console.log('Drop total :' + response.allocation.allocated);
                                    size.push("D:"+parseInt(response.allocation.allocated-response.used));

                                    callback(null,size );
                                    })
                                    .catch(function(error) {
                                     console.error(error);
                                    });

                      },
                      function(size, callback){
                        //box size
                        if(err) console.log(err);
                        if(!B_accesstoken) {
                            callback(null, size);
                            console.log("No Box Token by"+user_id);
                          }
                        client.users.get(client.CURRENT_USER_ID, null, function(err, info){
                              if(err)console.log(err);
                              else{
                                console.log("Box used : "+ info.space_used);
                                console.log("Box Total : "+ info.space_amount);
                                size.push("B:"+parseInt(info.space_amount-info.space_used));

                                callback(null, size );
                              }
                            });

                      }
                    ], function(err, result){

                          console.log(size);
                          distribution(size, req, res);
                    }
                  );



          }
        });

      };


//분할 function
  var distribution = function(sizelist, req, res){

    var size_array=[];
    var totalsize=0;

    for(var i = 0 ; i<sizelist.length;i++){
      size_array[i]=parseInt(sizelist[i].split(":")[1]);
      totalsize= totalsize+size_array[i];
    }
    var size_sort =JSON.parse(JSON.stringify( size_array ));
    if(req.file.size>totalsize){
      res.send(`alert('용량이 부족합니다.');
            history.go(-1);`)
    }
    else{
    console.log('file size is'+req.file.size);
    //65536 Bytes 이상만 분할가능
    var size=0;
    //연동된 드라이브 수 / 남은 용량에 맞게 분할시킬 사이즈 정해야한다.
    if(req.file.size>65536*3){
      size = parseInt(req.file.size/3);

    }
    else{
      if(req.file.size>65536*2){
        size = parseInt(req.file.size/2);

      }
      else{
        size= req.file.size;
      }
    }
    //추천 분할 용량과 각각 드라이브 최소 용량과 비교
    var min_size = size_sort.sort()[size_array.length];
    if(size>min_size&&min_size-1000>65536){
      //최소값이 전체 파일의 5분의 1보다도 작으면 -> 5개로 분할
      if(min_size<parseInt(req.file.size/5)){
        size = parseInt(req.file.size/5);

      }
      //최소값이 파일크기의 5분의 1보다 작지않으면 최소값-1000의 크기로 분할
      else{
        size = min_size - 1000;
      }

    }

    //최종 분할될 사이즈
    console.log("The spilt size is "+size);
    var pos_num = [];
    for ( var n = 0 ; n < size_array.length; n++){
      pos_num[n] = parseInt(size_array[n]/size);
    }
    //분리될 파일이 저장될곳
    var zipFile = java.newInstanceSync("net.lingala.zip4j.core.ZipFile",__dirname+"/uploads/dis/"+req.file.filename+".zip");
    var filesToAdd = java.newInstanceSync("java.util.ArrayList");
    //원래 파일 저장
    var orgFile =java.newInstanceSync("java.io.File",req.file.path);
    var parameters = java.newInstanceSync("net.lingala.zip4j.model.ZipParameters");
    parameters.setCompressionMethod(8, function(err, result){
      if(err){
        console.log(err);
      }
    });
    parameters.setCompressionLevel(5, function(err, result){
      if(err){
        console.log(err);
      }
    });
    filesToAdd.addSync(orgFile);
    //업로드를 하기 위한 분할 시작
    zipFile.createZipFile(filesToAdd, parameters, true, size ,function(err, result){
      if(err){
        console.log("Make Zip File : "+err);
      }else {
        zipFile.getSplitZipFiles(function(err, results){
          if(err){
            console.log("Split error : "+err);
          }
          else{
            //분할이 완료된 경우
            console.log("Complete Zip4J from " +req.file.filename);
            var numofdis = results.sizeSync();

            //원본파일삭제
            fs.unlink(req.file.path, function(err){
              if(err)throw err;
              console.log('Successfully deleted original file -> '+req.file.filename);
            })

            console.log("Number of distribution file : " + numofdis);
            //각각 분할된 파일 경로
            var listdis = [numofdis];
            for ( var i = 0 ; i < numofdis ; i++){
              listdis[i]=results.getSync(i);
              console.log(i+"'s path is "+listdis[i]);
            }
            upload_file(listdis,sizelist,pos_num, req, res);

          }
        });
      }
    })


    //

    }
  }

//분할 후 업로드
  var upload_file = function(listdis ,sizelist,pos_num, req, res){
        //parrellel로  계산
        var list = listdis;
        var size_array=[];
        var Glist=[];
        var Blist=[];
        var Dlist=[];

        //DB에 저장할 path
        var Gpath=[];
        var Bpath=[];
        var Dpath=[];
        //한번에 분할된 파일들의 경로를 저장한다.
        for(var i = 0 ; i<sizelist.length;i++){
          size_array[i]=sizelist[i].split(":")[0];
            }
        var flag=0

        //분할된 파일 경로 분배하기
        for(var j = 0 ; j < list.length ; j++){
          console.log("flag is "+flag + ", j is "+j);
          //가능한 용량으로 각각 분할된 파일 path 나누기
          switch (flag) {
            case 0:
            //사용자가 먼저 구글에 연동되어있는지 파악

              if(size_array.indexOf("G")>-1){
                //파일 전송 가능한 용량인지 파악
                if(pos_num[size_array.indexOf("G")]>0){
                  //전송가능하면 Glist에 path 추가하기
                  Glist.push(list[j]);
                  //가능 갯수 감소
                  pos_num[size_array.indexOf("G")]=pos_num[size_array.indexOf("G")]-1;
                  flag=1;
                  break;
                }
              }
              flag=1;
            case 1:
            //사용자가 먼저 박스에 연동되어있는지 파악
              if(size_array.indexOf("B")>-1){

                //파일 전송 가능한 용량인지 파악
                if(pos_num[size_array.indexOf("B")]>0){
                  //전송가능하면 Blist에 path 추가하기
                  Blist.push(list[j]);

                  //가능 갯수 감소
                  pos_num[size_array.indexOf("B")]=pos_num[size_array.indexOf("B")]-1;
                  flag=2;
                  break;
                }
              }
              flag=2;
            case 2:
            //사용자가 먼저 드롭박스에 연동되어있는지 파악
              if(size_array.indexOf("D")>-1){
                //파일 전송 가능한 용량인지 파악
                if(pos_num[size_array.indexOf("D")]>0){
                  //전송가능하면 Dlist에 path 추가하기
                  Dlist.push(list[j]);
                  //가능 갯수 감소
                  pos_num[size_array.indexOf("D")]=pos_num[size_array.indexOf("D")]-1;
                  flag=0;
                  break;
                }
              }
                flag=0;
          }
        }
        console.log(Dlist.length);
        //분배된 경로 비동기적으로 각각 드라이브 업로드
        async.parallel([
            function Google(callback_org){
              if(Glist.length>0){
                //async map 방식으로 각각 path에 있는 분할된 파일들을 비동기적으로 업로드.
                async.map(Glist,
                        function(file, callback){
                          //파일 이름만 가져오기 후에 이파일의 mime분석
                            var separatedfile =  file.split("/");
                            var filename=separatedfile[separatedfile.length-1];
                            var mimetype=mime.lookup(file);
                            console.log(filename);
                            console.log(mimetype);
                            //구글 드라이브에 업로드
                            Gdrive_upload.files.create({
                                resource: {'name' : filename},
                                media: {mimeType: mimetype,
                                        body: fs.createReadStream(file)},
                                fields: 'id'
                              }, function (err, uploadedfile) {
                                if (err) {
                                  // Handle error
                                  console.error(err);
                                } else {
                                  //업로드 후에 분할된 파일 삭제
                                  fs.unlink(file, function(err){
                                    if(err)throw err;
                                    console.log('Successfully deleted original file -> '+filename);
                                  })
                                  //최종적으로 완료후 callback 보내기
                                  console.log('Google File Id: ', uploadedfile.id);
                                  callback(null,uploadedfile.id);

                                }
                              });

                        },
                        function(err,result){
                            if(err) console.log(err);
                            //업로드 완료
                            else {
                              Gpath=result;
                              callback_org(null, "Google Completed");
                            }

                        }
                      );
              }
              else{callback_org(null, "No file uploaded to Google");}

            },
            function Box(callback_org){
              if(Blist.length>0){
                async.map(Blist,
                        function(file, callback){
                          //경로에서 파일이름 분리하기
                            var separatedfile = file.split("/");
                            var filename=separatedfile[separatedfile.length-1];
                            console.log("filename : "+ filename);
                            console.log("file : " + file);
                            //파일을 읽어오는 stream 생성
                            var stream = fs.createReadStream(file);
                            client.files.uploadFile(Bfolder, filename, stream, function(err ,newfile){
                              if(err) console.log(err);
                              else{
                              //업로드 후 분할된 파일 삭제
                              fs.unlink(file, function(err){
                                if(err)throw err;
                                console.log('Successfully deleted original file -> '+filename);
                              })
                              //callback으로 보내기
                                console.log("Box file id : " +newfile.entries[0].id);
                                callback(null,newfile.entries[0].id);

                              }
                            });

                        },
                        function(err,result){
                            if(err) console.log(err);
                            //업로드 완료
                            else {
                              Bpath=result;
                              callback_org(null, "Box Completed");
                            }
                        }
                      );
              }
              else{callback_org(null, "No file uploaded to Box");}
            },
            function Dropbox(callback_org){
              if(Dlist.length>0){
                async.map(Dlist,
                        function(file, callback){


                            var filename_KR=file.split("/")[10];
                            var content = fs.readFileSync(file);
                            //header에 한국말이 포함되지않아 업로드 할때에는 한국말을 뺀 상태로 업로드시킨다.
                            //그러나 다운로드 할때에는 파일의 이름을 가져와서 제대로된 파일명으로 다운로드
                            var pattern = /[^~!@#$%^&*()_+|<>.?:{}a-zA-Z0-9]/gi;
                            var filename = filename_KR.replace(pattern,"");
                            options = {
                                        method: "POST",
                                        url: 'https://content.dropboxapi.com/2/files/upload',
                                        headers: {
                                          "Content-Type": "application/octet-stream",
                                          "Authorization": "Bearer " + D_accesstoken,
                                          "Dropbox-API-Arg": "{\"path\": \"/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
                                        },
                                        body:content
                            };

                            request(options,function(err, res,body){
                              if(err){
                                console.log("Err : " + err);
                              }
                                  fs.unlink(file, function(err){
                                    if(err)throw err;
                                    console.log('Successfully deleted original file -> '+filename);
                                  })
                                  callback(null,filename);
                             })
                        },
                        function(err,result){
                            if(err) console.log(err);
                            //업로드 완료
                            else {
                              Dpath=result;
                              callback_org(null, "Drop Completed");
                            }
                        }
                      );
              }
              else{callback_org(null, "No file uploaded to dropbox");}
            }],
            function(err,results){          // Callback함수(기존 작업이 모두 종료되어야만 호출된다.)
                if(err){
                    return console.log(err);
                }
                console.log(results);
                //구글에 저장된 경로
                console.log(Gpath);
                //box에 저장된 경로
                console.log(Bpath);
                //dropbox에 저장된 경로
                console.log(Dpath);
                //DB에 저장하기
                path_save(Gpath,Bpath,Dpath,req,res);

            }
        );
  }

  var path_save = function(Gpatharr, Bpatharr, Dpatharr, req, res){

    var Gpath = Gpatharr.toString()
    , Dpath = Dpatharr.toString()
    , Bpath = Bpatharr.toString();
    //mime이 너무 큰경우 간단히 저장
    //-----후에 이것에 관한 로직 재성립 필요-----------
    if(req.file.mimetype=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
      var mimeType='application/pptx'
    }
    else{
      var mimeType=req.file.mimetype;
    }
    var fileinfo={
      Filename : req.file.originalname,
      size : req.file.size,
      mimetype : mimeType,
      date : present.toLocaleString(),
      Gpath : Gpath,
      Dpath : Dpath,
      Bpath : Bpath,
      user_ID : req.user._id,
      _sec : present.getTime()
    };

    //파일 정보 DB에 저장
    var file_sql = 'INSERT INTO File_info SET ?';
    conn.query(file_sql,fileinfo, function(err, result){
        if(err){
          console.log(err);
          //이전페이지로 돌아간다.

        }

      });

};


  route.post('/', upload.single('userfile'), function(req, res){
        //console.log(req.file);
        db_data(req.user._id, req, res);
        res.redirect('/welcome');
      });

  return route;
}
