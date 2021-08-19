const Archivo = require(`${__dirname}/../utils/Archivo`);
const cartsModel = new Archivo(`${__dirname}/../db/carts.txt`);
const productsModel = new Archivo(`${__dirname}/../db/products.txt`);
const controllersFactory = require(`${__dirname}/controllersFactory`);
exports.getAllCarts = (req, res, next) => {
	controllersFactory.getAll(req, res, next, cartsModel);
};
exports.addCart = (req, res, next) => {
	controllersFactory.addOne(req, res, next, cartsModel);
};

exports.deleteCart = (req, res, next) => {
	console.log('asdas');
	controllersFactory.deleteOne(req, res, next, cartsModel);
};

exports.getCart = (req, res, next) => {
	controllersFactory.getOne(req, res, next, cartsModel);
};

exports.addToCart = async (req, res, next) => {
	try {
		//Search cart by id
		const cartId = req.params.id;

		let cart = await cartsModel.findDataById(cartId);
		if (!cart) {
			const err = Error('There is no cart with that id');
			err.stCode = 404;
			throw err;
		}
		//Search product by id
		const prodId = req.body.productId;
		const product = await productsModel.findDataById(prodId);
		if (!product) {
			const err = new Error('There is no product with that id');
			err.stCode = 404;
			throw err;
		}
		//Request can indicate an specific amount, or will be 1 by deafult
		const amount = req.body.amount || 1;

		/*If the cart was not empty, have to look through products
		to check if product was already in the cart.*/
		let updated;
		if (cart.products.length > 0) {
			cart.products.forEach((prod) => {
				if (prod.id == prodId) {
					//If it was, update the product amount
					prod.amount += amount;
					updated = true;
				}
			});
		}
		/* Thi section updates the cart only if it was empty
		or if it was the first product to be added*/
		if (!updated) {
			product.amount = amount;
			cart.products.push(product);
		}
		//Update the Database
		const updatedCart = await cartsModel.findByIdAndUpdate(
			cartId,
			cart
		);
		//Decrease one stock from product ? May be after checkout
		res.status(200).json({
			status: 'success',
			...updatedCart,
		});
	} catch (err) {
		next(err);
	}
};
exports.deleteFromCart = async (req, res, next) => {
	try {
		const { cartId, productId } = req.params;
		const cart = await cartsModel.findDataById(cartId);
		const prodToDelete = await productsModel.findDataById(productId);

		if (!cart) {
			const err = new Error('There is no cart with that id');
			err.stCode = 404;
			throw err;
		}
		/* if (!prodToDelete) {
			const err = new Error('There is no product with that id');
			err.stCode = 404;
			throw err;
		} */
		/**
		 * Now we have to look in to the cart, to check if the product
		 * was there, the amount of them to be removed, and write it to the db
		 */
		let updated;
		cart.products.forEach(async (product, index) => {
			console.log(eval(productId) == product.id ? 'igual' : 'no');

			if (product.id == eval(productId)) {
				cart.products.splice(index, 1);
				updated = true;
				updatedCart = await cartsModel.findByIdAndUpdate(
					cartId,
					cart
				);
				res.status(200).json({
					status: 'success',
					updatedCart,
				});
			}
		});
		if (!updated) {
			const err = new Error(
				`Product was not in the cart number ${cartId}.`
			);
			err.stCode = 404;
			throw err;
		}
	} catch (err) {
		console.log('llegue al error');
		next(err);
	}
};
