# Carrent
## Car Rental Broker Webapp using Nodejs and Mysql
Pre-Requisites for the project

- Express
- Bootstrap
- body-parser
- node-mysql
- popups
- ejs

Do ```npm install``` for all the above packages or npm install from package.json dependencies.

## Database details
DB Name: carrent

1. Open cmd prompt and type mysql user:root  pass: root
2. ```create database carrent```;
3. ```use carrent```;

4. ```create table Car (VID INT(11) PRIMARY KEY AUTO_INCREMENT, LNo VARCHAR(20),LendID INT(11),Model VARCHAR(10),Capacity INT(11),Fuel VARCHAR(10),
   Colour VARCHAR(10),Trans VARCHAR(10),Cost INT(11));```
   
5. ```create table Rent (RentID INT(11) PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(20), Email VARCHAR(30), Pass VARCHAR(10), Phone varchar(10),Addr VARCHAR(40),
   Duration INT(10),FCost INT(10),VID INT(11));```
   
6. ```create table Lend (LendID INT(11) PRIMARY KEY AUTO_INCREMENT,Name VARCHAR(20), Email VARCHAR(30), Pass VARCHAR(10), Phone varchar(10), Addr VARCHAR(40),
   VID INT(11),VehicleName VARCHAR(20),LNo VARCHAR(20),Cost INT(11));```
   
7. ```create table login (Email varchar(50),Pass varchar(20),Phone varchar(10));```   
   
## DB Schema: 

###### Car
VID | LNo | LendID | Model | Capacity | Fuel | Colour | Trans | Cost
