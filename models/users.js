var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	phone: {type: String, required: true, index: {uique: true}},
	username: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true, select: false}, //select false dont query password
	wallets: {type: [], required: false}
});

UserSchema.pre("save", function(next) {
	var user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) {
 			return next(err)
		}
		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password) {
	var user = this; 
	return bcrypt.compareSync(password, user.password);
}

UserSchema.methods.addWallet = function(wallet) {
	var user = this;
	user.wallets.push(wallet);
	user.save(function(err) {
		if (err) {
			res.send(err);
			return;
		}
		res.json({ message: "User has been created"});
	});
}

module.exports = mongoose.model("User", UserSchema);
