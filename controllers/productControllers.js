const Archivo = require(`${__dirname}/../utils/Archivo`);
const productsModel = new Archivo(`${__dirname}/../db/products.txt`);
const controllersFactory = require(`${__dirname}/controllersFactory`);
exports.getAllProducts = (req, res, next) => {
	console.log(req.headers);
	controllersFactory.getAll(req, res, next, productsModel);
};

exports.getProduct = async (req, res, next) => {
	controllersFactory.getOne(req, res, next, productsModel);
};

exports.addProduct = (req, res, next) => {
	controllersFactory.addOne(req, res, next, productsModel);
};

exports.updateProduct = (req, res, next) => {
	controllersFactory.updateOne(req, res, next, productsModel);
};

exports.deleteProduct = (req, res, next) => {
	controllersFactory.deleteOne(req, res, next, productsModel);
};
