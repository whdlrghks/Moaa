var express = require('express');
var app = express();
var java = require('java');
var path = require('path');

java.classpath.push(path.resolve(__dirname,'zip4j-1.3.2.jar'));
console.log(__dirname);
java.classpath.push("./");


var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/org/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
});
var upload = multer({ storage: storage }).single('userfile')



app.set('views', './view');           // New!!
app.set('view engine', 'ejs');
app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload',
//upload.single('userfile'),
function(req, res){
  upload(req,res,(function(err){
    if(err){
      return res.end("Error uploading file.");
    }
    
    res.end("File is uploaded");
  }))
  //65536 Bytes 이상만 분할가능
//   var size=0;
//   //연동된 드라이브 수 / 남은 용량에 맞게 분할시킬 사이즈 정해야한다.
//   if(req.file.size>65536*3){
//     size = parseInt(req.file.size/3);
//   }
//   else{
//     if(req.file.size>65536*2){
//       size = parseInt(req.file.size/2);
//
//     }
//     else{
//       size= req.file.size;
//     }
//   }
// console.log("split size : "+size);
//   //분리될 파일이 저장될곳
//   var zipFile = java.newInstanceSync("net.lingala.zip4j.core.ZipFile",__dirname+"/uploads/dis/"+req.file.filename+".zip");
//   var filesToAdd = java.newInstanceSync("java.util.ArrayList");
//   //원래 파일 저장
//   var orgFile =java.newInstanceSync("java.io.File",__dirname+"/"+req.file.path);
//   var parameters = java.newInstanceSync("net.lingala.zip4j.model.ZipParameters");
//   parameters.setCompressionMethod(8, function(err, result){
//     if(err){
//       console.log(err);
//     }
//   });
//   parameters.setCompressionLevel(5, function(err, result){
//     if(err){
//       console.log(err);
//     }
//   });
//
//   filesToAdd.addSync(orgFile);
//   zipFile.createZipFile(filesToAdd, parameters, true, size ,function(err, result){
//     if(err){
//       console.log(err);
//     }else {
//       zipFile.getSplitZipFiles(function(err, results){
//         if(err){
//           console.log("Split error : "+err);
//         }
//         else{
//           console.log("Complete Zip4J from " +req.file.filename);
//           console.log(results.sizeSync());
//           console.log(results.getSync(0));
//         }
//       });
//     }
//   });
//   res.send('Uploaded! : '+req.file); // object를 리턴함
//   console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});
app.listen(3000, function () {

  console.log('Example app listening on port 3000!');
});
