const Product = require(`${__dirname}/../models/productsModel.js`);

exports.viewAllProducts = async (req, res, next) => {
	try {
		//Try to get all the products and send them if success

		const filter = {
			name: req.query.name || /m*/,
			category: req.query.category || /m*/,
			price: {
				$lte: req.query.maxPrice || 9999999,
				$gte: req.query.minPrice || 0,
			},
			stock: {
				$lte: req.query.maxStock || 9999999,
				$gte: req.query.minStock || 0,
			},
		};

		const order = req.query.orderBy
			? JSON.parse(req.query.orderBy)
			: {};

		const products = await Product.find(filter).sort(order);

		let message;
		if (!products) {
			message = 'There are no products loaded';
		}
		res.render('products.ejs', {
			query: req.query,
			products,
			message,
		});
	} catch (err) {
		//Handle errors
		console.log(err);
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

		//Write product

		const product = await Product.create(req.body);
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
