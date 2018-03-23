var app = require('./config/express')();
var passport = require('./config/passport')(app);
var google_url = require('./config/google_auth_url')();
var conn = require('./config/db')();
var dropbox_url =  'https://www.dropbox.com/oauth2/authorize?locale=ko-KR&response_type=code&client_id=1dww360qpj331fz';

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
//start page
app.get('/index', function(req, res){
  res.render('index',{title: 'First Title!'});
});

app.get('/login_error', function(req, res){
  res.render('login_error');
});

//session을 가지고 dashboard에 들어가는경우
app.get('/welcome', function(req, res){
  if(req.user && req.user.username) {
    //일치할경우 welcome.ejs에 req.user.user_ID와 req.user.user_ID를 결합하여 보내서 이것을 기반으로
    //DB에서 유저의 파일 리스트를 불러온다.
    //이것은 세션이므로 페이지를 옮길때마다 항상 유지된다!
  var search_sql = "SELECT file_ID,filename, mimetype, date, size FROM File_info where user_ID = ?";
  conn.query(search_sql,req.user._id, function(err, list){
    if(err){
      console.log(req.user._id+"'s file list' : "+ err);
      res.render('welcome',{
        user_ID : req.user._id,
        Name: req.user.username
      });
    }
    else{
      res.render('welcome',{
        user_ID : req.user._id,
        Name: req.user.username,
        filelist: list
      });
    }
  });

  }
  else res.redirect('/index');
});

app.get('/auth_token/googleindex', function(req, res){
  res.render('auth_token/googleindex', {
    Name: req.user.username,
    url: google_url
  });
});

app.get('/auth_token/dropboxindex', function(req, res){
  res.render('auth_token/dropboxindex', {
    Name: req.user.username,
    url : dropbox_url
  });
});

app.get('/auth_token/boxindex', function(req, res){
  res.render('auth_token/boxindex', {
    Name: req.user.username
  });
});

var download = require('./routes/download')();
app.use('/download/',download);

var upload = require('./routes/upload')();
app.use('/upload/',upload);

//refresh 하기
var refresh = require('./routes/refresh_token')();
app.use('/refresh/',refresh);

//auth 과정
var auth = require('./routes/auth_login')(passport);
// '/auth/' 자동으로 가져간다. 고로 auth_login에서는 뒤에있는 login이나 logout같은것만 가져간다.
app.use('/auth/', auth);

var auth_google = require('./auth_drive/auth_google')();
// '/google/' 사용자가 구글을 인증하였을때 자동으로 이 라우트안으로 들어가서 DB에 token들을 저장한다.
app.use('/google/', auth_google);

var auth_dropbox = require('./auth_drive/auth_dropbox')();
// '/google/' 사용자가 구글을 인증하였을때 자동으로 이 라우트안으로 들어가서 DB에 token들을 저장한다.
app.use('/dropbox/', auth_dropbox);

var auth_box = require('./auth_drive/auth_box')();
// '/google/' 사용자가 구글을 인증하였을때 자동으로 이 라우트안으로 들어가서 DB에 token들을 저장한다.
app.use('/box/', auth_box);
