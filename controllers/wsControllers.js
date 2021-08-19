const Archivo = require(`${__dirname}/../utils/Archivo`);
const db = new Archivo(`${__dirname}/../db/products.txt`);
const dbMsgs = new Archivo(`${__dirname}/../db/messages.txt`);

/**
 *
 * @returns Table of products updated.
 */

exports.getTable = async () => {
	try {
		//Search the products
		const products = await db.readData();
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
		//format the date and time of the message and
		//saves it to the db
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sept',
			'Oct',
			'Nov',
			'Dec',
		];
		const dateTime = new Date();
		const dateTimeMsg = `${dateTime.getDate()} ${
			months[dateTime.getMonth()]
		} | ${dateTime.getHours()}:${dateTime.getMinutes()}`;
		await dbMsgs.saveData({ ...msg, date: dateTimeMsg });
		//
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
		const messages = await dbMsgs.readData();
		return messages;
	} catch (err) {
		console.log(err);
	}
};
