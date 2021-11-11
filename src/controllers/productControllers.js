const {
  getAll,
  updateOne,
  getOne,
  deleteOne,
  addOne,
} = require(`${__dirname}/../services/factoryServices`);

const Product = require(`${__dirname}/../models/productsModel.js`);
exports.getAllProducts = async (req, res, next) => {
  /* 	controllersFactory.getAll(req, res, next, Product);
   */ try {
    const products = await getAll(req.query, Product);
    console.log(products);
    return res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const user = await getOne(req.params.id, Product);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
  /*  controllersFactory.getOne(req, res, next, User); */
};

exports.addProduct = async (req, res, next) => {
  try {
    const newProduct = await addOne(req.body, Product);
    return res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
  /*   controllersFactory.addOne(req, res, next, Product);
   */
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateOne(req.params.id, req.body, Product);
    return res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await deleteOne(req.params.id, Product);
    return res.status(203).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
  /*   controllersFactory.deleteOne(req, res, next, Product);
   */
};
