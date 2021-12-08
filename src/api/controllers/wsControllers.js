const Product = require('../models/productsModel');
const Message = require('../models/messagesModel');
const User = require('../models/usersModel');
const ErrorCreator = require('../../utils/ErrorCreator');
const { schema, normalize } = require('normalizr');

/**
 *
 * @returns Table of products updated.
 */

exports.getTable = async () => {
	try {
		//Search the products
		const products = await Product.find();
		let message;
		if (!products) {
			message = 'There are no products loaded';
		}
		//Return the products and/or any warning message
		return { products, message };
	} catch (err) {
		console.log(err);
	}
};
/**
 *
 * @msg  Load a new chat msg and store it in the database
 */
exports.updateMessages = async (msg) => {
	try {
		//Find user with the email from the msg
		
		const user = await User.findOne({ email: msg.user });
		if (!user)
			throw new ErrorCreator(404, "There's no user with that email");
		//Create new message in the database
		await Message.create({ author: user._id, message: msg.message });
	} catch (err) {
		console.log(err);
	}
};
/**
 *
 * @messages from chat sent by users.
 */
exports.getMessages = async () => {
	try {
		
		const chats = await Message.find({}).populate('author');
		/* const originalData = { id: 'messages', chat: chats };
		const authors = new schema.Entity('authors');

		const normalizedData = normalize(originalData, authors); */
        console.log(chats)
		return  chats ;
	} catch (err) {
		console.log(err);
	}
};
