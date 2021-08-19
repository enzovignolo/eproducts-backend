/* This is the controller factory.
Intended for reusing repetitive code.
Here we can have normal CRUD operations over a DB Model in a simpler way
 */
const db = require(`${__dirname}/../db/db`);
exports.getAll = async (req, res, next, model) => {
	try {
		//Try to get all the products and send them if success

		const data = await db.select().table(model);

		if (!data) {
			const error = new Error('No data was loaded');
			error.stCode = 404;
			throw error;
		}
		res.status(200).json({
			status: 'success',
			results: data.length,
			data,
		});
	} catch (err) {
		next(err);
	}
};
exports.addOne = async (req, res, next, model) => {
	try {
		//Gets the new entry to the DB from the body
		const newEntry = req.body;

		const data = await db(model).insert(newEntry);
		//If the function did not return a product, there was an error
		if (!data) throw new Error('Error writting in the DB');

		res.status(201).json({
			status: 'success',
		});
	} catch (err) {
		next(err);
	}
};

exports.updateOne = async (req, res, next, model) => {
	try {
		const id = req.params.id;
		const data = req.body;
		//Check first if exist an entrey with that id

		/* const updatedEntry = await Model.findByIdAndUpdate(id, data); */
		const updatedEntry = await db(model).where('id', id).update(data);
		if (!updatedEntry) {
			const err = new Error(`Wrong id for ${model}`);
			err.stCode = 404;
			throw err;
		}
		res.status(201).json({
			status: 'success',
			...updatedEntry,
		});
	} catch (err) {
		next(err);
	}
};
exports.deleteOne = async (req, res, next, model) => {
	try {
		const id = req.params.id;
		//Check if the product exists
		const data = await db.where('id', id).select().table(model);

		console.log(data);
		if (data.length <= 0) {
			const error = new Error('There is no element with that id');
			error.stCode = 404;
			throw error;
		}
		//Delete it
		const deletedEntry = await db(model).where('id', id).del();
		res.status(200).json({
			status: 'success',
			deleted: data,
		});
	} catch (err) {
		next(err);
	}
};

exports.getOne = async (req, res, next, model) => {
	try {
		const id = req.params.id;
		//Looks for the product
		//const data = await Model.findDataById(id);
		let data;
		if (model != 'carts') {
			data = await db.where('id', id).select().table(model);
		} else {
			const productsOnCart = await db
				.from('cart_product')
				.innerJoin(
					'products',
					'cart_product.product_id',
					'products.id'
				)
				.select(
					'products.id',
					'products.name',
					'products.price',
					'products.stock',
					'products.thumbnail'
				)
				.where('cart_product.cart_id', id);
			let cart = [];
			productsOnCart.forEach((product) => {
				cart.push(product);
			});
			data = { cartId: id, products: cart };
		}

		if (data.length <= 0) {
			const error = new Error('There is no element with that id');
			error.stCode = 404;
			throw error;
		}
		res.status(200).json({
			status: 'success',
			data,
		});
	} catch (err) {
		next(err);
	}
};
