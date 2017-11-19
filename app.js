var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');
var connection = mysql.createConnection({

  host     : 'localhost',
  user     : 'root',
  password : 'root',      //Change According to your mysql settings
  database : 'carrent'
});
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var obj = [];

app.listen(3000,function(req,res){
    console.log('Node server running @ http://localhost:3000')
	 /*connection.query('SELECT * FROM car', function(err, result) {

        if(err){
            throw err;
        } else {
            obj = JSON.parse(JSON.stringify(result));
            console.log(obj);
           res.render('Car', { obj: obj });
        }*/
   // });
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

app.get('/showSignInPageretry',function(req,res){
    res.sendFile('signinretry.html',{'root': __dirname + '/templates'});
});


app.get('/rentInput',function(req,res){
    res.sendFile('rentinput.html',{'root': __dirname + '/templates'});
});
app.get('/lend',function(req,res){
    res.sendFile('lendinput.html',{'root': __dirname + '/templates'});
});

app.get('/lendsubmit',function(req,res){
    res.sendFile('lendsubmit.html',{'root': __dirname + '/templates'});
});

app.post('/registeruser', function(req, res){

console.log(req.body);
var newuser = {email: req.body.email, pass: req.body.pass, user:req.body.fname, phone:req.body.phone};
connection.query('INSERT INTO login SET ?', newuser, function(err,res){
      if(err) throw err;
    console.log('Last record insert id:', res.insertId);
  });

     res.redirect('/signin');
});


app.post('/verifyuser', function(req, res){
  console.log('checking user in database');
  console.log(req.body.pass);
  var selectString = 'SELECT COUNT(email) FROM login WHERE email="'+req.body.email+'" AND pass="'+req.body.pass+'" ';

  connection.query(selectString, function(err, results) {

        console.log(results);
        var string=JSON.stringify(results);
        console.log(string);
        //this is a walkaround of checking if the email pass combination is 1 or not it will fail if wrong pass is given
        if (string === '[{"COUNT(email)":1}]') {
      res.redirect('/rentPage');

          }
        if (string === '[{"COUNT(email)":0}]')  {
          res.redirect('/showSignInPageretry');

        }
});



});
var obj = [];
app.post('/submitRent', function(req,res){
	console.log('Rent details input');

	console.log(req.body);

//	console.log(req.body);
	var sel = 'SELECT * FROM Car WHERE Model="'+req.body.Model+'" AND Capacity="'+req.body.Capacity+'" AND Fuel="'+req.body.Fuel+'" AND Trans="'+req.body.Trans+'" ';


	connection.query(sel, function(err,result){
	
        if(err){
            throw err;
        } else {
            obj = JSON.parse(JSON.stringify(result));
            console.log(obj);
           res.render('rent', { obj: obj });
        }
	});
	
});




app.post('/lendInput', function(req, res) {
	console.log('Lent details input');
	console.log(req.body);
	var record = {Name: req.body.name, Email: req.body.email, Phone: req.body.phone, Addr: req.body.addr , VehicleName: req.body.vehiclename , LNo :req.body.licence};
	
	var record2 = {Model: req.body.Model, Capacity: req.body.Capacity, Fuel: req.body.Fuel, Trans: req.body.Transmission, Colour: req.body.Colour, Cost: req.body.Cost,LNo :req.body.licence};
	
	//connection.connect();
	connection.query('INSERT INTO car SET ?', record2, function(err,res){
	  	if(err) throw err;
	  	console.log('Last record insert id:', res.insertId);
	});
	
	
	connection.query('INSERT INTO lend SET ?', record, function(err,res){
	  	if(err) throw err;
		console.log('Last record insert id:', res.insertId);
	
	});
	var sel = 'UPDATE lend SET VID = (SELECT VID FROM Car WHERE LNo="'+req.body.licence+'" ) WHERE LNO="'+req.body.licence+'"';
	connection.query(sel, function(err, result) {

        if(err){
            throw err;
        } 
           //res.render('rent', { obj: obj });
        
    });
	
	//connection.query('INSERT INTO lend SET ?', record, function(err,res){
	  //	if(err) throw err;
		//console.log('Last record insert id:', res.insertId);

	//});
	
	
	
	

	res.redirect('/lendsubmit');
	//connection.end();

	//res.end();
});
// **********RENT******
app.set('view engine', 'ejs');
var obj = [];
app.get('/carDetails', function(req, res){

    connection.query('SELECT * FROM Car', function(err, result) {

        if(err){
            throw err;
        } else {
            obj = JSON.parse(JSON.stringify(result));
            console.log(obj);
           res.render('rent', { obj: obj });
        }
    });
});


app.post('/rentTransact', function(req, res){
	console.log(req.body.vid);
    connection.query('SELECT Name,Email,phone,Addr,LNo,VehicleName,VID FROM lend WHERE VID="'+req.body.vid+'"', function(err, result) {

    	console.log('running query');
        if(err){
            throw err;
        } 
        else if(!(result.length>0)){
        	res.sendFile('noowner.html',{'root': __dirname + '/templates'});				   // REDIRECT TO OWNER NOT FOUND PAGE TO BE ADDED
        }
        else {
            obj = JSON.parse(JSON.stringify(result));
            console.log(obj);
           res.render('renttransaction', { obj: obj });
        }
    });
});
