var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({

  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'mydb'
});
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(3000,function(){
    console.log('Node server running @ http://localhost:3000')
});

app.get('/',function(req,res){
    res.sendFile('index.html',{'root': __dirname + '/templates'});

});
