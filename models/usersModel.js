const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	email: {
		type: String,
		required: [true, 'User must have an email'],
	},
	name: {
		type: String,
	},
	lastName: {
		type: String,
	},
	age: {
		type: Number,
		min: [0, "User's age must be positive"],
	},
	alias: {
		type: String,
	},
	avatar: {
		type: String,
	},
});

const User = model('User', userSchema);

module.exports = User;