var java = require("java");
var path = require('path');

java.classpath.push(path.resolve(__dirname,'dropbox-core-sdk-3.0.4.jar'));
java.classpath.push("./src");
// var MyClass = java.import("com.nearinfinity.nodeJava.MyClass");
//
// var result = MyClass.addNumbersSync(1, 2);
// console.log(result);
var dropBoxAppKey = '1dww360qpj331fz';
var dropBoxAppSecret = 'udjl9iorf8oxomk';
var dropbox_ac_code='kFb_ENWtmyUAAAAAAAAA_Qqib_XKG424qWuAysOTy_Y';
var getdropboxtoen = java.import("com.nearinfinity.nodeJava.GetDropboxToken");
var result = getdropboxtoen.authDropbox(dropBoxAppKey,dropBoxAppSecret,dropbox_ac_code);
console.log(result);
