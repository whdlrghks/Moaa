var path = require('path');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var CLIENT_ID = '1020724062873-q2905dvpi2rkp2afc5geu3ib136mo21e.apps.googleusercontent.com';
var CLIENT_SECRET =  'wYcSZSLwufXFLAaH7xFi9Rby';
var REDIRECT_URL = "http://localhost:3000/google/callback";
var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var fs = require('fs');
var G_accesstoken='ya29.GlxSBRmTc_kxkBbFEo5oC7Vu49nqFV4FRJrWw13cbnnKkYO47d2kFTTxzI9TEBs3KZsrN-ucdHxgLHgku_NUj7C7b7ihjWg-ohh4GgOVNbsF1_lLzDgGQrFQxLPoXw';
var G_refreshtoken='1/EoNJ2X-pTEqxOde_M6EhWM4lUfAA9xbuSVgtLIE55do';
//특정사용자에 대한 정보에 따른 oAuth2 생성
oauth2Client.credentials={
access_token: G_accesstoken,
refresh_token: G_refreshtoken
};
//드라이브 접근
var drive = google.drive({ version: 'v3', auth: oauth2Client });

var drive2 = google.drive({ version: 'v2', auth: oauth2Client });
// drive2.about.get(function(req, res){
//   console.log('used : '+ res.quotaBytesUsed);
//   console.log('Total : '+ res.quotaBytesTotal);
// });
// console.log("test");
// //파일 업로드
// drive.files.create({
//   resource: {
//     name: 'testimage.png',
//     mimeType: 'image/png'
//   },
//   media: {
//     mimeType: 'image/png',
//     body: fs.createReadStream('./anycloud-100686749-large.png') // read streams are awesome!
//   }
// }, //callback 함수
// listFiles(oauth2Client));

//다운로드
function download (fileId) {
  drive.files.get({
    fileId: fileId
  }, (err, metadata) => {
    if (err) {
      throw err;
    }
    console.log('Downloading %s...', metadata.name);
    const dest = fs.createWriteStream(metadata.name);

    drive.files.get({
      fileId: fileId,
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
        process.exit();
      })
      .on('error', err => {
        console.error('Error writing file!');
        throw err;
      });
  });
}

//파일 리스트
function listFiles(auth) {
  var service = google.drive('v3');
  service.files.list({
    auth: auth,
    pageSize: 10,
    fields: "nextPageToken, files(id, name)"
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.files;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
      console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('%s (%s)', file.name, file.id);
      }
    }
  });
}

download('18-L9Yvqah3g23esZ00tHNa_FvPRFBwFS');
