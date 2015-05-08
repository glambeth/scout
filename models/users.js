var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	phone: {type: String, required: true, index: {uique: true}},
	username: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true, select: false} //select false dont query password
	wallets: {type: [], required: true}
});
