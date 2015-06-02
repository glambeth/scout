var express = require('express')
var User = require('../models/users');
var config = require('../config');
var jsonwebtoken = require('jsonwebtoken');
var chain = require('chain-node');
var secretKey = config.secretKey;
var api = express.Router();

//chain.apiKeyId = 'KEY_ID';
//chain.apiKeySecret = 'YOUR_SECRET_KEY';


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

api.post('/chain', function(req, res) {
	User.find({wallets: req.body.address}, function(err, users) {
		res.send(users);

	});

});

api.use(function(req, res, next){
	console.log("Somebody came to the app");
	var token = req.body.token || req.param("token") || req.headers["x-access-token"];
	if (token) {
		jsonwebtoken.verify(token, secretKey, function(err, decoded) {
			if (err) {
				res.status(403).send({success: false, message: "failed to authenticate user"});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(403).send({success: false, message: "No Token Provided"});
	}
});

api.route('/')
	.post(function(req, res) {
		User.findOne({ _id: req.decoded.id }, function(err, user) {
			if (err){
				res.send(err);
				return;
			}
			console.log(user);
			user.addWallet(req.body.wallet);
			chain.createNotification({type: "address", block_chain: "bitcoin", address: req.body.wallet, url:"www.scout.io/api/chain"}, function(err, res) {
				if (err) {
					res.send(err);
				} else {
					res.send(res);
				}
			});
		});
	})

	.get(function(req, res) {
		User.find({__id: req.decoded.id}, function(err, users) {
			if (err) {
				res.send(err);
				return;
			}
			res.json(users);
		});
	})

	.delete(function(req, res) {
		User.findOne({ _id: req.decoded.id }, function(err, user) {
			if (err) {
				res.send(err);
				return;
			}
			user.removeWallet(req.body.wallet);
			res.json(user);
		});	
	});

module.exports = api;
