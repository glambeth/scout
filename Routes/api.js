var User = require('../models/users');
var config = require('../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;

function createToken(user) {
	var token = jsonwebtoken.sign({
		id: user._id,
		phone: user.phone,
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

	api.post("/login", function(req, res) {
		User.findOne({ username: req.body.username }).select("password").exec(function(err, user) {
			if (err) {
				throw err;
			}
			if (!user) {
				res.send({message: "User Does not exist"});
			} else if (user) {
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.send({message: "Invalid Password"});
				} else {
					//create a token for the user
					var token = createToken(user);
					res.json({
						success: true,
						message: "Sucessful login",
						token: token
					});
				}
			}
		});
	});

	return api;
}
