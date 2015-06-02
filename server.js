var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')
var config = require('./config');
var mongoose = require("mongoose");
var api = require('./Routes/api');
var app = express();

mongoose.connect(config.database, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to the database');
	}
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname));
app.use('/api', api);

app.get('', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
	console.log("http://www." + req.hostname + "/api/chain")
});

app.listen(3000, function(err) {
	if (err) {
		console.log(err);  
	} else {
		console.log("listening on port 3000");
	}
}); 





