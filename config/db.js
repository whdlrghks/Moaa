module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host :'localhost',
    user :'root',
    password :'1234',
    database :'moaa_dev'
  });
  conn.connect();
  return conn;
}
