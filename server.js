var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')
var config = require('./config');
var mongoose = require("mongoose");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + "/public"));

app.listen(3000, function(err) {
	if (err) {
		console.log(err);  
	} else {
		console.log("listening on port 3000");
	}
}); 
