var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');
var cookieParser = require('cookie-parser');
var randtoken = require('rand-token');
var bodyParser = require('body-parser');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());// For Parsing cookie send from browser
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use(express.static('templates'))
app.use(express.static(path.join(__dirname, 'templates/css')));

app.set('view engine', 'ejs');

var connection = mysql.createConnection({

	host     : 'localhost',
	user     : 'root',
  password : 'root',      //Change According to your mysql settings
  database : 'carrent'
});

var obj = [];
var vid;
var user;

//SESSION CHECK FUNCTION
function sessionCheck(checktoken,callback) {
	var selectString='SELECT COUNT(email) FROM login WHERE email="'+user+'" AND sid="'+checktoken+'" ';
	connection.query(selectString, function(err, results) {
		string=JSON.stringify(results);
		console.log(string);
		if(err)
			callback(err,null);
		else if(string === '[{"COUNT(email)":1}]'){
			callback(null,1);
		}
		else{
			callback(null,0);
		}

	});
}

app.listen(3000,function(req,res){
	console.log('Node server running @ http://localhost:3000');
});


app.get('/',function(req,res){
	res.sendFile('index.html',{'root': __dirname + '/templates'});

});

app.get('/rentPage',function(req,res){

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data)
			res.sendFile('profile.html',{'root': __dirname + '/templates'});	
		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});
	
});

app.get('/showSignInPageretry',function(req,res){
	res.sendFile('signinretry.html',{'root': __dirname + '/templates'});
});


app.get('/rentInput',function(req,res){

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data)
			res.sendFile('rentinput.html',{'root': __dirname + '/templates'});	
		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});
	
});

app.get('/lend',function(req,res){

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data)
			res.sendFile('lendinput.html',{'root': __dirname + '/templates'});	
		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});

	
});

app.get('/lendsubmit',function(req,res){

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data)
			res.sendFile('lendsubmit.html',{'root': __dirname + '/templates'});
		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});
	
});

app.get('/signup',function(req,res){
	res.sendFile('signup.html',{'root': __dirname + '/templates'});
});

app.get('/signupretry',function(req,res){
	res.sendFile('signupretry.html',{'root': __dirname + '/templates'});
});

app.get('/logout',function(req,res){
	res.clearCookie("sid");
	console.log("loggin out");
	connection.query('UPDATE login SET sid=NULL WHERE email="'+user+'"',function(err,res){
		if(err) throw err;
		console.log('Session id deleted from database');

	});
	res.redirect('/');
});

app.get('/carDetails', function(req, res){

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data){
			connection.query('SELECT * FROM Car', function(err, result) {
				if(err){
					throw err;
				} 
				else {
					obj = JSON.parse(JSON.stringify(result));
					console.log(obj);
					res.render('rent', { obj: obj });
				}
			});
		}	
		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});

});

app.post('/registeruser', function(req, res){

	var selectString = 'SELECT COUNT(email) FROM login WHERE email="'+req.body.email+'" ';

	connection.query(selectString, function(err, results) {

		console.log(results);
		var string=JSON.stringify(results);
		console.log(string);
        //this is a walkaround of checking if the email pass combination is 1 or not it will fail if wrong pass is given
        if (string === '[{"COUNT(email)":0}]') {

        	console.log(req.body);
        	var newuser = {email: req.body.email, pass: req.body.pass, phone:req.body.phone};
        	connection.query('INSERT INTO login SET ?', newuser, function(err,res){
        		if(err) throw err;
        		console.log('Last record insert id:', res.insertId);
        	});

        	res.redirect('/rentPage');

        }

        else   {

        	res.redirect('/signupretry');
        }
    });


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
        	user=req.body.email;
        	var token=randtoken.generate(16);
        	connection.query('UPDATE login SET sid="'+token+'"WHERE email="'+user+'"',function(err,res){
        		if(err) throw err;
        		console.log('Session id inserted in database');

        	});
        	res.cookie('sid' ,token,{maxAge : 600000});
        	res.redirect('/rentPage');

        }
        if (string === '[{"COUNT(email)":0}]')  {
        	res.redirect('/showSignInPageretry');

        }
    });


});

app.post('/submitRent', function(req,res){

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data){
			var sel = 'SELECT * FROM Car WHERE Model="'+req.body.Model+'" AND Capacity="'+req.body.Capacity+'" AND Fuel="'+req.body.Fuel+'" AND Trans="'+req.body.Trans+'" ';
			connection.query(sel, function(err,result){
				if(err){
					throw err;
				} 
				else {
					obj = JSON.parse(JSON.stringify(result));
					console.log(obj);
					res.render('rent', { obj: obj });
				}
			});
		}
		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});


});

app.post('/lendInput', function(req, res) {

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data){
			var record = {Name: req.body.name, Email: req.body.email, Phone: req.body.phone, Addr: req.body.addr , VehicleName: req.body.vehiclename , LNo :req.body.licence, Cost:req.body.Cost};	
			var record2 = {Model: req.body.Model, Capacity: req.body.Capacity, Fuel: req.body.Fuel, Trans: req.body.Transmission, Colour: req.body.Colour, Cost: req.body.Cost,LNo :req.body.licence};
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

			});
			var sel = 'UPDATE car SET LendID = (SELECT LendID FROM lend WHERE LNo="'+req.body.licence+'" ) WHERE LNO="'+req.body.licence+'"';
			connection.query(sel, function(err, result) {
				if(err){
					throw err;
				} 
			});
			res.redirect('/lendsubmit');
		}
		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});
});

app.post('/rentTransact', function(req, res){

	var selectString='SELECT COUNT(email) FROM login WHERE email="'+user+'" AND sid="'+req.cookies.sid+'" ';
	connection.query(selectString, function(err, results) {
		string=JSON.stringify(results);
        if (string === '[{"COUNT(email)":1}]') {     	
        	console.log(req.body);
	vid=req.body.vid;
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
	//var sel = 'SELECT Cost FROM car WHERE LNo = (SELECT VID FROM Car WHERE LNo="'+req.body.licence+'" ) WHERE LNO="'+req.body.licence+'"';
	//connection.query('SELECT Cost FROM car')
}
else {
	res.sendFile('session.html',{'root': __dirname + '/templates'});
}

});

});

var obj2=[];
app.post('/rentCar', function(req,res){

	sessionCheck(req.cookies.sid,function(err,data){
		if(err){
			console.log("ERROR : ",err);
		}
		else if(data){
			console.log(req.body);  		
			if(req.body.vid === vid){
				var record = {Name: req.body.name, Email: req.body.email, Phone: req.body.phone, Addr: req.body.addr, Duration: req.body.duration, VID: req.body.vid};
				connection.query('INSERT into rent SET ?', record, function(err,res){
					if(err)
						throw err;			
				});			
				connection.query('SELECT (car.Cost * rent.Duration) as FCost FROM car,rent WHERE car.VID=rent.VID AND rent.VID="'+req.body.vid+'"',function(err,result){
					if(err)
						throw err;
					else {

						obj = JSON.parse(JSON.stringify(result).slice(1,-1));            
						var x = obj.FCost;
						console.log(x);
						connection.query('UPDATE rent SET FCost ="'+x+'" WHERE VID="'+req.body.vid+'"', function(err,result){
							if(err){
								throw(err);
							}
						}); 

					}
				});

				connection.query('DELETE FROM car WHERE VID ="'+req.body.vid+'"', function(err,res){
					console.log('running delete query');
					if(err)
						throw(err);	
				});
				res.sendFile('thenks.html',{'root': __dirname + '/templates'});
			}
			else{
				res.sendFile('noowner.html',{'root': __dirname + '/templates'});
			}
		}

		else
			res.sendFile('session.html',{'root': __dirname + '/templates'});
	});
});
