/* This is the controller factory.
Intended for reusing repetitive code.
Here we can have normal CRUD operations over a DB Model in a simpler way
 */

const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);

const filterBuilder = (queryObj, arrayFilter) => {
	let filter = {};
	Object.keys(queryObj).map((queryFilter) => {
		if (arrayFilter.includes(queryFilter)) {
			filter[queryFilter] = queryObj[queryFilter];
		}
	});
	return filter;
};

exports.getAll = async (req, res, next, Model) => {
	try {
		//Try to get all the products and send them if success
		let filter = {};
		let sortBy = {};
		console.log(req.query);
		//Build the filter from the query string

		if (Model.modelName == 'Product') {
			filter = filterBuilder(req.query, [
				'_id',
				'name',
				'category',
				'price',
				'stock',
			]);
		}
		if (req.query.sort) {
			sortBy = req.query.sort;
		}
		const data = await Model.find(filter).sort(sortBy);

		if (!data) {
			throw new ErrorCreator('No data was loaded', 404);
		}
		res.status(200).json({
			status: 'success',
			results: data.length,
			data,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
exports.addOne = async (req, res, next, Model) => {
	try {
		//Gets the new entry to the DB from the body
		const newEntry = req.body;

		const data = await Model.create(newEntry);
		//If the function did not return a product, there was an error
		if (!data) throw new ErrorCreator('Error writting in the DB', 500);

		res.status(201).json({
			status: 'success',
			data,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.updateOne = async (req, res, next, Model) => {
	try {
		const id = req.params.id;
		const data = req.body;
		//Check first if exist an entrey with that id

		const updatedEntry = await Model.findByIdAndUpdate(id, data, {
			new: true,
		});

		if (!updatedEntry) {
			throw new ErrorCreator(`Wrong id for ${Model.modelName}`, 404);
		}
		res.status(201).json({
			status: 'success',
			data: updatedEntry,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
exports.deleteOne = async (req, res, next, Model) => {
	try {
		const id = req.params.id;
		//Check if the product exists
		const data = await Model.findById(id);

		console.log(data);
		if (!data) {
			throw new ErrorCreator(
				'There is no element with that id',
				404
			);
		}
		//Delete it
		const deletedEntry = await Model.findByIdAndDelete(id);
		res.status(203).json({
			status: 'success',
		});
	} catch (err) {
		next(err);
	}
};

exports.getOne = async (req, res, next, Model) => {
	try {
		const id = req.params.id;
		//Looks for the data
		let data;
		if (Model.modelName == 'Cart') {
			/* Populate makes that products informations appears instead of 
			an array of products ids*/
			data = await Model.findById(id).populate('products');
		} else {
			data = await Model.findById(id);
		}

		if (!data) {
			throw new ErrorCreator(
				'There is no element with that id',
				404
			);
		}
		res.status(200).json({
			status: 'success',
			data,
		});
	} catch (err) {
		next(err);
	}
};
