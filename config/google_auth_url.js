module.exports = function(){
  var google = require('googleapis');

  var OAuth2 = google.auth.OAuth2;
  var CLIENT_ID = '1020724062873-q2905dvpi2rkp2afc5geu3ib136mo21e.apps.googleusercontent.com';
  var CLIENT_SECRET =  'wYcSZSLwufXFLAaH7xFi9Rby';
  var REDIRECT_URL = "http://localhost:3000/google/callback";
  var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


  var scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
  });
  return url;
}
