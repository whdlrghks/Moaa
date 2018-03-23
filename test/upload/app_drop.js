var Dropbox = require('dropbox');
var dbx = new Dropbox({ accessToken: 'kFb_ENWtmyUAAAAAAAABRhvnb14PfMC6SdiLVRrrVm_1SccCLywMYGZWbTKa8kCc' });
var fs = require('fs');
var stream = fs.readFileSync('/Users/ikhwan/dev/js/moaa_dev/Moaa/routes/uploads/dis/1517912013357(M)한이음_MOAA 최종본.mp4.z01','utf-8');
var request = require('request');
var mime = require('mime');
var http = require('https');
// dbx.filesListFolder({path: ''})
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });
//
//업로드
// mime.lookup('/Users/ikhwan/dev/js/moaa_dev/Moaa/routes/uploads/dis/1517903510204(M)한이음_MOAA 최종본.mp4.zip');
// fs.readFile('/Users/ikhwan/dev/js/moaa_dev/Moaa/routes/uploads/dis/1517903510204(M)한이음_MOAA 최종본.mp4.zip','utf-8', function read(err, data) {
//     if (err) {
//       throw err;
//     }
//     fileupload(data);
//   });
//
//   function fileupload(content) {
//
//     var accesstoken = 'kFb_ENWtmyUAAAAAAAABRhvnb14PfMC6SdiLVRrrVm_1SccCLywMYGZWbTKa8kCc'
//     var url = 'https://content.dropboxapi.com/2/files/upload';
//     var options = {
//       'Authorization': 'Bearer '+accesstoken,
//        'Dropbox-API-Arg' : {
//          'path' :'/1517903510204(M)한이음_MOAA 최종본.mp4.zip',
//          'mode' :'add',
//          'autorename' : true,
//          'mute': false
//        },
//        'Content-Type' : 'application/octet-stream'
//     }
//     var promise = request.post({
//         url: url,
//         headers: options,
//
//       }).write('--data-binary @1517903510204(M)한이음_MOAA 최종본.mp4.zip\r\n');
    // promise.then(function(err,res){
    //
    //   if(err) console.log('Encountered error: '+err);
    //
    //   console.log('Response: '+JSON.stringify(res));
    // })
    //   .on('end',function(err, res){
    //
    // if(err) console.log('Encountered error: '+err);
    //
    // console.log('Response: '+JSON.stringify(res));
    //
    // });
    // request.post('https://content.dropboxapi.com/2/files/upload',
    // {
    //   headers:{ Authorization: 'Bearer '+accesstoken, 'Content-Type': 'application/octet-stream',
    //   'Dropbox-API-Arg': {path: "/1517903510204(M)한이음_MOAA 최종본.mp4.zip",mode: "add", autorename: true, mute: false}}
    //   ,
    //
    //  body: content}, function optionalCallback (err, httpResponse, bodymsg) {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   console.log(httpResponse);
    //   console.log("HERE");
    // });
  //}

// dbx.filesUpload({path: '/' + "1517912013357(M)한이음_MOAA 최종본.mp4.z01", contents: stream})
//       .then(function(response) {
//        console.log(response);
//      })
//       .catch(function(error) {
//        console.error(error);
//      });

// dbx.readFile("1517901456149(M)한이음_MOAA 최종본.mp4.zip", {binary : true}, function(error, data) {
//           if (error) {
//             return showError(error);  // Something went wrong.
//             throw new Error(error);
//           }
//             toastr.info("Storing update..");
//             console.log(data);
//             fs.writeFile(__dirname+'/download/1517901456149(M)한이음_MOAA 최종본.mp4.zip', data, 'binary', function(err) {
//                 if(err) {
//                     return showError(error);
//                 }
//
//                 toastr.info("Update complete!");
//             });
//         });
// var filename="1517901456149(M)한이음_MOAA 최종본.mp4.zip";
// var url = dbx.filesGetTemporaryLink({path: '/' + filename});
// url.then(function(result){
//   //console.log(result);
//   console.log("URL : "+result.link);
//   var output = fs.createWriteStream('./download/'+filename);
//     var request = http.get(result.link, function(response) {
// response.pipe(output);
// });
// });
// //다운로드
// var promise = dbx.filesDownload({path: '/' + "1517901456149(M)한이음_MOAA 최종본.mp4.zip"});
// promise.then(function(result){
//
//   fs.writeFile(__dirname+'/download/'+result.name, result.fileBinary, 'utf-8' , function(err){
//     console.log("Completed download "+result.name);
//   });
// }, function(err){
//
// });
      // .then(function(response) {
      //   console.log(response.Binary);
      // fs.writeFile(__dirname+'/download/'+response.name, response.Binary, 'utf-8' , function(err){
      //   console.log("Completed download "+response.name);
      // })
      //  //console.log(response);
      // })
      // .catch(function(error) {
      //  console.error(error);
      // });

//file size
//
// dbx.usersGetSpaceUsage()
//       .then(function(response) {
//       console.log('used :' + response.used);
//       console.log('total :' + response.allocation.allocated);
//       console.log(response.allocation.allocated-response.used);
//        //console.log(response);
//       })
//       .catch(function(error) {
//        console.error(error);
//       });
