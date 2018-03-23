var fs = require('fs');
var BoxSDK = require('box-node-sdk');

var http = require('https');

var CLIENT_ID = 'f4tpda8l96cv2cu2kllw2vqzt5pgfyp0';
var CLIENT_SECRET =  'RehLRXaUytGhBCg3GcFhUs9ReAf0bO35';
var sdk = new BoxSDK({
  clientID: CLIENT_ID, // required
  clientSecret: CLIENT_SECRET // required
});
var USER_ACCESS_TOKEN='bEjf2V7dKfbEuFxaV1CRgDJfbTE5kxCA';
// Create a basic API client
var client = sdk.getBasicClient(USER_ACCESS_TOKEN);
var folder_name="MOAA";

//
// client.users.get(client.CURRENT_USER_ID, null, function(err, info){
//   if(err)console.log(err);
//   else{
//     console.log("used : "+ info.space_used);
//     console.log("Total : "+ info.space_amount);
//
//   }
// });
// //
// //업로드
// var stream = fs.createReadStream('./anycloud-100686749-large.png');
// client.files.uploadFile('45630727316', 'anycloud-100686749-large213.png', stream, function(err ,newfile){
//   if(err) console.log(err);
//   else{
//   //파일 아이디
//     console.log(newfile.entries[0].id);
//   }
// });
//
// //다운로드
var fs2 = require('fs');
client.files.get('273611275927', null, function(err, newfile){
  if(err){
    console.log(err);
  }
  else {
    var filename = newfile.name;
     //async function getfile(){
    client.files.getDownloadURL('273611275927', null, function(error, downloadURL) {

    	if (error) {
    		//handle error
    	}
      var output = fs.createWriteStream('./download/'+filename);
        var request = http.get(downloadURL, function(response) {
    response.pipe(output);
  });
    	//process the downloadURL
    });

  // }
  // function getfilefromURL(downloadURL,output) {
  //                              return new Promise(resolve => {
  //
  //                              });
  //                            }


  }});


    // client.files.getReadStream('273611275927', null, function(error, stream) {
    //
    // 	if (error) {
    // 		// handle error
    //     console.log(err);
    // 	}
    //
    // 	// write the file to disk
    // 	var output = fs.createWriteStream('./download/'+filename);
    // 	stream.pipe(output).on('finish',function(){
    //     console.log("finish");
    //   });
    //   console.log("Test");
    // });
