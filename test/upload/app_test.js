var express = require('express');
var app = express();

var fs = require('fs');
var multiparty = require('multiparty');

app.set('views', './view');           // New!!
app.set('view engine', 'ejs');
app.get('/upload', function(req, res){
  res.render('upload', { title: 'Express' });
});

app.post('/upload', function (req, res) {
    var form = new multiparty.Form({
        autoFiles: false, // 요청이 들어오면 파일을 자동으로 저장할 것인가
        uploadDir: __dirname+'/uploads/', // 파일이 저장되는 경로(프로젝트 내의 temp 폴더에 저장됩니다.)
        maxFilesSize: 1024 * 1024 * 5 // 허용 파일 사이즈 최대치
    });

    form.parse(req, function (error, fields, files) {
        // 파일 전송이 요청되면 이곳으로 온다.
        // 에러와 필드 정보, 파일 객체가 넘어온다.
        var path = files.fileInput[0].path;
        console.log(path);
        res.send(path); // 파일과 예외 처리를 한 뒤 브라우저로 응답해준다.
    });
});
app.listen(3000, function () {

  console.log('Example app listening on port 3000!');
});
