const controllersFactory = require(`${__dirname}/controllersFactory.js`);
const User = require(`${__dirname}/../models/usersModel.js`);
exports.getAllUsers = (req, res, next) => {
	controllersFactory.getAll(req, res, next, User);
};

exports.addUser = (req, res, next) => {
	controllersFactory.addOne(req, res, next, User);
};

exports.getUser = (req, res, next) => {
	controllersFactory.getOne(req, res, next, User);
};

exports.updateUser = (req, res, next) => {
	controllersFactory.updateOne(req, res, next, User);
};

exports.deleteUser = (req, res, next) => {
	controllersFactory.deleteOne(req, res, next, User);
};
