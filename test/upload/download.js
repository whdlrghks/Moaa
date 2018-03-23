var fs = require('fs');
var unzip = require('unzip');
var path2 = __dirname+"/uploads/dis/";
var java = require('java');
var path = require('path');

java.classpath.push(path.resolve(__dirname,'zip4j-1.3.2.jar'));

java.classpath.push("./");
// console.log(path2);
// var dirPath  = __dirname + "/../public/compressed/nodejs-zip-files.zip";
//
//   var destPath = __dirname+"/uploads/plus/";
//
//   fs.createReadStream(dirPath).pipe(unzip.Extract({ path: destPath }));
// var zipFile = java.newInstanceSync("net.lingala.zip4j.core.ZipFile",path2+'1517458096457IT 서비스 아이디어 공모전_MOAA.mp4.zip');
var file = java.newInstanceSync("java.io.File","/Users/ikhwan/Downloads/test/1517912013357(M)한이음_MOAA 최종본.mp4.zip");
//var zip4jconstants = java.newInstanceSync("net.lingala.zip4j.util.Zip4jConstants");

console.log(file.getAbsolutePathSync());
    var zipFile = java.newInstanceSync("net.lingala.zip4j.core.ZipFile",file.getAbsolutePathSync());
    zipFile.extractAll("/Users/ikhwan/Downloads/test/ikhwan/", function(err,result){
      if(err) console.log(err);
      console.log(result);
    });

// var zipFile2 = java.newInstanceSync("net.lingala.zip4j.core.ZipFile",'/Users/ikhwan/dev/js/moaa_dev/Moaa/routes/downloads/dis/1517467394834(M)연구 목적.png.zip');
// //var writeStream = fs.Writer(__dirname+"/uploads/plus");
// zipFile2.extractAll(__dirname+"/uploads/plus/", function(err,result){
//   if(err) console.log(err);
//   console.log(result);
// });

// fs.createReadStream(path+'1517458096457IT 서비스 아이디어 공모전_MOAA.mp4.zip')
// .pipe(unzip.Extract({ path: __dirname+"/uploads/plus" }));
