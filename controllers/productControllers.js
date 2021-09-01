const controllersFactory = require(`${__dirname}/controllersFactory`);
const Product = require(`${__dirname}/../models/productsModel.js`);
exports.getAllProducts = (req, res, next) => {
	controllersFactory.getAll(req, res, next, Product);
};

exports.getProduct = async (req, res, next) => {
	controllersFactory.getOne(req, res, next, Product);
};

exports.addProduct = async (req, res, next) => {
	controllersFactory.addOne(req, res, next, Product);
};

exports.updateProduct = (req, res, next) => {
	controllersFactory.updateOne(req, res, next, Product);
};

exports.deleteProduct = (req, res, next) => {
	controllersFactory.deleteOne(req, res, next, Product);
};
