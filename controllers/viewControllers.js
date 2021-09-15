const Product = require(`${__dirname}/../models/productsModel.js`);
const User = require(`${__dirname}/../models/usersModel.js`);
const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);

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
		//Check if there is any message to send
		let message = req.query ? req.query.message : null;
		res.render('addProduct.ejs', { message });
	} catch (err) {
		next(err);
	}
};

exports.addProduct = async (req, res, next) => {
	try {
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

exports.loginForm = (req, res, next) => {
	try {
		let message = req.query ? req.query.message : null;
		res.render('loginForm.ejs', { message });
	} catch (err) {
		console.log(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) throw new ErrorCreator('User does not exist', 401);

		if (user.password != password)
			throw new ErrorCreator('Wrong password', 401);
		req.session.isLogged = 'true';
		req.session.user = user.name;

		res.redirect(`/addProduct?message=Welcome ${user.name}`);
	} catch (err) {
		console.log(err);
		res.redirect(`/login?message=${err.msg}`);
	}
};

exports.isLogged = (req, res, next) => {
	if (req.session.isLogged) {
		next();
	} else {
		const message = 'You must be logged to see this page';
		res.redirect(`/login?message=${message}`);
	}
};

exports.logout = (req, res, next) => {
	const user = req.session.user;
	req.session.destroy();
	res.render('logout.ejs', { user });
};
