const Product = require(`${__dirname}/../models/productsModel.js`);
const Message = require(`${__dirname}/../models/messagesModel.js`);

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
		await Message.create(msg);
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
		const messages = await Message.find();

		return messages;
	} catch (err) {
		console.log(err);
	}
};
