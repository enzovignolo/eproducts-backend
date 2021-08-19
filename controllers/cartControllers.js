const Archivo = require(`${__dirname}/../utils/Archivo`);
const cartsModel = new Archivo(`${__dirname}/../db/carts.txt`);
const productsModel = new Archivo(`${__dirname}/../db/products.txt`);
const controllersFactory = require(`${__dirname}/controllersFactory`);
const db = require(`${__dirname}/../db/db`);
exports.getAllCarts = (req, res, next) => {
	controllersFactory.getAll(req, res, next, 'carts');
};
exports.addCart = (req, res, next) => {
	controllersFactory.addOne(req, res, next, 'carts');
};

exports.deleteCart = (req, res, next) => {
	console.log(req.params.id);
	controllersFactory.deleteOne(req, res, next, 'carts');
};

exports.getCart = (req, res, next) => {
	controllersFactory.getOne(req, res, next, 'carts');
};

exports.addToCart = async (req, res, next) => {
	try {
		//Search cart by id
		const cartId = req.params.id;

		let cart = await db('carts').where('id', cartId).select();
		if (cart.length <= 0) {
			const err = Error('There is no cart with that id');
			err.stCode = 404;
			throw err;
		}
		//Search product by id
		const prodId = req.body.productId;
		const product = await db('products').where('id', prodId);
		if (product.length <= 0) {
			const err = new Error('There is no product with that id');
			err.stCode = 404;
			throw err;
		}

		const updatedCart = await db('cart_product').insert({
			cart_id: cartId,
			product_id: prodId,
		});
		//Decrease one stock from product ? May be after checkout
		res.status(200).json({
			status: 'success',
			updatedCart,
		});
	} catch (err) {
		next(err);
	}
};
exports.deleteFromCart = async (req, res, next) => {
	try {
		const { cartId, productId } = req.params;
		const cart = await db('carts').where('id', cartId).select();

		if (!cart) {
			const err = new Error('There is no cart with that id');
			err.stCode = 404;
			throw err;
		}
		const productDeleted = await db('cart_product')
			.where({
				cart_id: cartId,
				product_id: productId,
			})
			.del();
		res.status(200).json({ status: 'success' });
	} catch (err) {
		console.log('llegue al error');
		next(err);
	}
};
