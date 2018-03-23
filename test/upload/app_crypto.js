var crypto = require("crypto");

function encrypt(text,key){
 /* 알고리즘과 암호화 key 값으로 셋팅된 클래스를 뱉는다 */
    var cipher = crypto.createCipher('aes-256-cbc',key);

 /* 컨텐츠를 뱉고 */
    var encipheredContent = cipher.update(text,'utf8','hex');

 /* 최종 아웃풋을 hex 형태로 뱉게 한다*/
    encipheredContent += cipher.final('hex');

    return encipheredContent;
}

/*암호화나 복호화나 자세히 보면 비슷함*/
function decrypt(text,key){

    var decipher = crypto.createDecipher('aes-256-cbc',key);

    var decipheredPlaintext = decipher.update(text,'hex','utf8');

    decipheredPlaintext += decipher.final('utf8');

    return decipheredPlaintext;
}

/*이제 테스트 해봐야지*/
var key = "CrisTinaDO_RoNAldo";
var text = "우리는 민족중흥의 사명을 띄고 이땅에 태어 났다. 조상에 빛난 얼을 오늘에 되살려 안으로 자주독립 자세를 확립하고 밖으로 인류공영에 이바지할 때다. 박정희 아자씨 시러요";
var hw = encrypt(text,key);
console.log("################### 인코딩 ##################");
console.log(hw);

console.log("################### 디코딩 ##################");
console.log( decrypt(hw,key) );
