//chain API Key ID: 8f84a0b8a17796d205c580134ee4dd97
//Chain API Key Secret: fdf8e20dfacfd77b04766efec1ac12b3

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')
var config = require('./config');
var mongoose = require("mongoose");
var api = require('./Routes/api')
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


app.post('', function(req, res) {
	console.log("CHAIN API POST")
	console.log(req.body)
	res.send(req.json)

});

app.get('', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
	console.log("HI")
});

app.listen(3000, function(err) {
	if (err) {
		console.log(err);  
	} else {
		console.log("listening on port 3000");
	}
}); 





