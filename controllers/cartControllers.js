const Cart = require(`${__dirname}/../models/cartsModel.js`);
const Product = require(`${__dirname}/../models/productsModel.js`);
const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
const controllersFactory = require(`${__dirname}/controllersFactory`);

exports.getAllCarts = (req, res, next) => {
	controllersFactory.getAll(req, res, next, Cart);
};
exports.addCart = (req, res, next) => {
	controllersFactory.addOne(req, res, next, Cart);
};

exports.deleteCart = (req, res, next) => {
	controllersFactory.deleteOne(req, res, next, Cart);
};

exports.getCart = (req, res, next) => {
	controllersFactory.getOne(req, res, next, Cart);
};

exports.addToCart = async (req, res, next) => {
	try {
		const { cartId, productId } = req.params;
		const product = await Product.findById(productId);
		if (!product) {
			throw new ErrorCreator(
				'There is no product with that id',
				404
			);
		}

		console.log(cartId);
		if (!(await Cart.findById(cartId))) {
			throw new ErrorCreator('There is no cart with that id', 404);
		}
		const cart = await Cart.findByIdAndUpdate(
			cartId,
			{ $push: { products: product } },
			{ new: true }
		);

		//Decrease one stock from product ? May be after checkout
		res.status(200).json({
			status: 'success',
			data: cart,
		});
	} catch (err) {
		next(err);
	}
};
exports.deleteFromCart = async (req, res, next) => {
	try {
		const { cartId, productId } = req.params;
		const cart = await Cart.findById(cartId);

		if (!cart) {
			throw new ErrorCreator('There is no cart with that id', 404);
		}
		const product = await Product.findById(productId);
		if (!product) {
			throw new ErrorCreator(
				'There is no product with that id',
				404
			);
		}
		if (!cart.products.includes(productId)) {
			throw new ErrorCreator('That product is not in the cart', 400);
		}
		const updatedCart = await Cart.findByIdAndUpdate(
			cartId,
			{ $pull: { products: productId } },
			{ new: true }
		);
		res.status(200).json({ status: 'success', data: updatedCart });
	} catch (err) {
		next(err);
	}
};
