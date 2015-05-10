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
	var api = express.Router();
	api.post('/signup', function(req, res) {
		var user = new User({
			phone: req.body.phone,
			username: req.body.username,
			password: req.body.password
		});
		user.save(function(err) {
			if (err) {
				res.send(err);
				return;
			}
			res.json({ message: "User has been created"});
		});
	});

}
