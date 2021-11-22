const Product = require(`${__dirname}/../models/productsModel.js`);
const Message = require(`${__dirname}/../models/messagesModel.js`);
const User = require(`${__dirname}/../models/usersModel.js`);
const ErrorCreator = require(`${__dirname}/../../utils/ErrorCreator.js`);
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

		return  chats ;
	} catch (err) {
		console.log(err);
	}
};
