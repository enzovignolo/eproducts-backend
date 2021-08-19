/* This is the controller factory.
Intended for reusing repetitive code.
Here we can have normal CRUD operations over a DB Model in a simpler way
 */

exports.getAll = async (req, res, next, Model) => {
	try {
		//Try to get all the products and send them if success
		const data = await Model.readData();
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
exports.addOne = async (req, res, next, Model) => {
	try {
		const newEntry = req.body;
		//Add timestamp to the entry
		newEntry.createdAt = new Date().toISOString();
		//Write new entry
		const data = await Model.saveData(newEntry);
		//If the function did not return a product, there was an error
		if (!data) throw new Error('Error writting in the DB');

		res.status(201).json({
			status: 'success',
			...data,
		});
	} catch (err) {
		next(err);
	}
};

exports.updateOne = async (req, res, next, Model) => {
	try {
		const id = req.params.id;
		const data = req.body;
		//Check first if the product exists
		if (!(await Model.findDataById(id))) {
			const error = new Error('There is no product with that id');
			error.stCode = 404;
			throw error;
		}
		//Update it
		const updatedEntry = await Model.findByIdAndUpdate(id, data);
		res.status(201).json({
			status: 'success',
			...updatedEntry,
		});
	} catch (err) {
		next(err);
	}
};
exports.deleteOne = async (req, res, next, Model) => {
	try {
		const id = req.params.id;
		//Check if the product exists
		if (!(await Model.findDataById(id))) {
			const error = new Error('There is no element with that id');
			error.stCode = 404;
			throw error;
		}
		//Delete it
		const deletedEntry = await Model.findByIdAndDelete(id);
		res.status(200).json({
			status: 'success',
			deleted: deletedEntry,
		});
	} catch (err) {
		next(err);
	}
};

exports.getOne = async (req, res, next, Model) => {
	try {
		const id = req.params.id;
		//Looks for the product
		const data = await Model.findDataById(id);
		//Sent error if there is no product
		if (!data) {
			const error = new Error('There is no element with that id');
			error.stCode = 404;
			throw error;
		}
		res.status(200).json({
			status: 'success',
			...data,
		});
	} catch (err) {
		next(err);
	}
};
