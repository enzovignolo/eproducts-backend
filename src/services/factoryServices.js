/**
 * This service contain basic CRUD operations that are similar
 * to every model
 */

const filterBuilder = require('../utils/filterBuilder');
const ErrorCreator = require('../utils/ErrorCreator');
/**
 *
 * @param {Query obj} queryObj to use as a filter
 * @param {Mongoose Model} Model to query all documents
 * @returns
 */
exports.getAll = async (queryObj, Model) => {
  try {
    let filter = {};
    let sortBy = {};

    //Build the filter from the query string

    if (Model.modelName == 'Product') {
      filter = filterBuilder(queryObj, [
        '_id',
        'name',
        'category',
        'price',
        'stock',
      ]);
    }
    if (queryObj.sort) {
      sortBy = queryObj.sort;
    }

    const data = await Model.find(filter).sort(sortBy);

    if (!data) {
      throw new ErrorCreator('No data was loaded', 404);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {ObjectId} id OF THE DOCUMENT TO UPDATE
 * @param {Object} data DATA TO UPDATE THE DOCUMENT
 * @return Updated Documnet
 */

exports.updateOne = async (id, data, Model) => {
  try {
    const updatedEntry = await Model.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedEntry) {
      throw new ErrorCreator(`Wrong id for ${Model.modelName}`, 404);
    }

    return updatedEntry;
  } catch (err) {
    throw err;
  }
};

exports.getOne = async (id, Model) => {
  try {
    //Looks for the data
    let data;
    if (Model.modelName == 'Cart') {
      /* Populate makes that products informations appears instead of 
      an array of products ids*/
      data = await Model.findById(id).populate('products');
    } else {
      data = await Model.findById(id);
    }
    console.log('holaaaaaaa',data);

    if (!data) {
      throw new ErrorCreator('There is no element with that id', 404);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
/**
 *
 * @param {ObjectId} id Of the document to delete
 * @param {Mongoose Model} Model where the document can be found
 * @returns
 */
exports.deleteOne = async (id, Model) => {
  try {
    //Check if the product exists
    const data = await Model.findById(id);

    if (!data) {
      throw new ErrorCreator('There is no element with that id', 404);
    }
    //Delete it
    const deletedEntry = await Model.findByIdAndDelete(id);
    return deletedEntry;
  } catch (err) {
    throw err;
  }
};

exports.addOne = async (newEntry, Model) => {
  try {
    //Gets the new entry to the DB from the body

    const data = await Model.create(newEntry);
    //If the function did not return a product, there was an error
    if (!data) throw new ErrorCreator('Error writting in the DB', 500);

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
