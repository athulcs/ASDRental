var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');
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
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
//app.use('/templates/css',  express.static(__dirname + '/templates/css'));
app.use(express.static('templates'))
app.use(express.static(path.join(__dirname, 'templates/css')));
app.get('/',function(req,res){
    res.sendFile('index.html',{'root': __dirname + '/templates'});

});
app.get('/signin',function(req,res){
    res.sendFile('signin.html',{'root': __dirname + '/templates'});
});
app.get('/rentPage',function(req,res){
    res.sendFile('signin.html',{'root': __dirname + '/templates'});
});

app.post('/verifyuser', function(req, res){
  console.log('checking user in database');
  console.log(req.body.pass);
  var selectString = 'SELECT COUNT(email) FROM mytable1 WHERE email="'+req.body.email+'" AND pass="'+req.body.pass+'" ';

  connection.query(selectString, function(err, results) {

        console.log(results);
        var string=JSON.stringify(results);
        console.log(string);
        //this is a walkaround of checking if the email pass combination is 1 or not it will fail if wrong pass is given
        if (string === '[{"COUNT(email)":1}]') {
      res.redirect('/');

          }
        if (string === '[{"COUNT(email)":0}]')  {
          res.redirect('/showSignInPageretry');

        }
});



});
