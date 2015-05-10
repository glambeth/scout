var User = require('../models/user');
var config = require('../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;

function createToken(user) {
	var token = jsonwebtoken.sign({
		id: user._id,
		phone: user.phone;
		username: user.username
	}, secretKey, {
		expiresInMinute: 14460
	});
	return token;
}

module.exports = function(app, express) {
	//signup logic
	







}
