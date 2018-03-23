

  var google = require('googleapis');
  var conn = require('../config/db')();
  var OAuth2 = google.auth.OAuth2;
  var CLIENT_ID = '1020724062873-q2905dvpi2rkp2afc5geu3ib136mo21e.apps.googleusercontent.com';
  var CLIENT_SECRET =  'wYcSZSLwufXFLAaH7xFi9Rby';
  var REDIRECT_URL = "http://localhost:3000/google/callback";
  var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  //DB에서 현재의 access_token과 refresh_token 읽어와서 credentials에 넣는다.
  oauth2Client.credentials={
  access_token: 'ya29.GltGBfPYUb5l6cdbTJBegiR9BdBhM-jKFToRznWyW9ZVjvYwftDoVgDdQ3xtIOy57FFeif7NKySBvpmgnh-HwsnwAELjQ3E_UCFpW4Q3YqxY15mk3mlhgFgLBtv6',
  refresh_token: '1/TxGUkVQb2rcyMoAwNxZWFAsUBdrQzFo8WY_Six3-Thg'

};

//그런다음 새로운 토큰을 받는다. 그리고 그 accesstoken을 다시 db에 저장한다.

oauth2Client.refreshAccessToken(function(err, tokens) {
  console.log(oauth2Client.credentials.access_token);
});
