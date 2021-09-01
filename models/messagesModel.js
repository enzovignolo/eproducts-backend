const { Schema, model } = require('mongoose');

const messageSchema = Schema({
	user: {
		type: String,
		required: [true, 'Message must have a user'],
	},
	message: {
		type: String,
		required: [true, 'Message must have a message text'],
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

const Message = model('Message', messageSchema);

module.exports = Message;
