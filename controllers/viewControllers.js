/* const Archivo = require(`${__dirname}/../utils/Archivo`);
const db = new Archivo(`${__dirname}/../db/products.txt`); */
const db = require(`${__dirname}/../db/db`);
exports.viewAllProducts = async (req, res, next) => {
	try {
		//Try to get all the products and send them if success
		const products = await db('products').select();
		let message;
		if (!products) {
			message = 'There are no products loaded';
		}
		res.render('products.ejs', { products, message });
	} catch (err) {
		//Handle errors
		next(err);
	}
};

exports.viewAddProductForm = async (req, res, next) => {
	try {
		res.render('addProduct.ejs');
	} catch (err) {
		next(err);
	}
};

exports.addProduct = async (req, res, next) => {
	try {
		const newProduct = req.body;
		newProduct['stock'] = 1;
		//Write product
		const product = await db('products').insert(newProduct);
		//If the function did not return a product, there was an error
		if (!product) throw new Error('Error writting in the DB');
		res.redirect('/addProduct');
	} catch (err) {
		next(err);
	}
};

exports.chatView = (req, res, next) => {
	res.render('chat.ejs');
};
