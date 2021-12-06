const Cart = require('../models/cartsModel.js');

const cartControllers = require('./cartControllers.js');
const User = require('../models/usersModel.js');
const ErrorCreator = require('../../utils/ErrorCreator');
const notifications = require('../../utils/notifications.js');
const {
  getAll,
  getOne,
  updateOne,
} = require('../../services/factoryServices');
exports.getAllUsers = async (req, res, next) => {
  /*   controllersFactory.getAll(req, res, next, User);
   */
  try {
    const users = await getAll(req.query, User);
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  /* 	controllersFactory.addOne(req, res, next, User);
   */
  try {
    const cart = await Cart.create({});

    if (!cart) throw new ErrorCreator(404, 'Please indicate a cart ID');
    const user = await User.create({ ...req.body, cart: cart._id });
    if (!user)
      throw new ErrorCreator(500, 'There was a problem with user creation');
    return res.status(200).json({
      status: 'success',
      cart,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.getUserCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'cart',
      populate: { path: 'products' },
    });

    if (!user) throw new ErrorCreator(404, 'There is no user with that id');
    if (!user.cart) {
      const cart = await Cart.create({});
      user.cart = cart._id;
      await user.save();
    }
    return res.status(200).json({
      status: 'success',
      data: user.cart,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.makePurchase = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(['_id', 'email']);
    if (!user) throw new ErrorCreator(404, 'No user with that id');

    const productsToBuy = req.body.data.map((product) => {
      return `-${product.name} : $ ${product.price}`;
    });
    console.log(productsToBuy);
    notifications.notifyPurchase(user, productsToBuy);

    res.status(200).json({ status: 'done' });
  } catch (err) {
    cosnole.log(err);
  }
};

exports.updateUserCart = (req, res, next) => {
  cartControllers.addToCart(req, res, next);
};
exports.deleteFromUserCart = (req, res, next) => {
  cartControllers.deleteFromCart(req, res, next);
};
exports.getUser = async (req, res, next) => {
  try {
    const user = await getOne(req.params.id, User);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
  /*  controllersFactory.getOne(req, res, next, User); */
};

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await updateOne(req.params.id, req.body, User);
    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await deleteOne(req.params.id, User);
    return res.status(203).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
  /*   controllersFactory.deleteOne(req, res, next, Product);
   */
};
