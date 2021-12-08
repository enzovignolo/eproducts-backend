const { Schema, model } = require('mongoose');

const messageSchema = Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
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
