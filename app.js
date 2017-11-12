var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({

  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ASDdb'
});
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded