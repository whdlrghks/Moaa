var async = require('async');
var mime = require('mime');

// [2] map
// map함수는 배열객체의 원소에 대해 반복함수를 수행하고 마지막으로 배열 결과 객체를 얻을수 있음.
//
// var arr  = [1,2,3,4,5];
// async.map(arr,
//     function(item, callback){   // 배열의 1~5까지 id와 uuid를 발급하여 키밸류 생성하여 콜백함수의 result로 리턴
//         callback(null, item*item);
//     },
//     function(err,result){
//         if(err) console.log(err);
//         else console.log(result);
//     }
// );
// var path="/Users/ikhwan/dev/js/moaa_dev/Moaa/routes/uploads/org/1517385295583(M)1517306266029Capstone_Schetch612_final.pdf.zip";
// console.log(path.split("/")[10]);
//
// console.log(mime.lookup(path));
// Async 모듈 Import
async.parallel([
    function task1(callback){
        setTimeout(function(){
            console.log("task1");
            callback(null, "one");      // 콜백 함수로 에러로그와 result인 "one"을 전달하면 콜백함수는 이를 배열에 저장한다.
        },1000);
    },
    function task2(callback){
        setTimeout(function(){
            console.log("task2");
            callback(null,"two");       // 콜백 함수로 에러로그와 result인 "one"을 전달하면 콜백함수는 이를 배열에 저장한다.
        }, 3000);
    },
    function task3(callback){
        setTimeout(function(){
            console.log("task3");
            callback(null, "three");    // 콜백 함수로 에러로그와 result인 "one"을 전달하면 콜백함수는 이를 배열에 저장한다.
        }, 2000);
    }],
    function(err,results){          // Callback함수(기존 작업이 모두 종료되어야만 호출된다.)
        if(err){
            return console.log(err);
        }
        console.log(results);
    }
);
