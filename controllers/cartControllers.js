const User = require(`${__dirname}/../models/usersModel`);
const mongoose = require('mongoose');
const Cart = require(`${__dirname}/../models/cartsModel.js`);
const Product = require(`${__dirname}/../models/productsModel.js`);
const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
const controllersFactory = require(`${__dirname}/controllersFactory`);

exports.getAllCarts = (req, res, next) => {
  controllersFactory.getAll(req, res, next, Cart);
};
exports.addCart = (req, res, next) => {
  controllersFactory.addOne(req, res, next, Cart);
};

exports.deleteCart = (req, res, next) => {
  controllersFactory.deleteOne(req, res, next, Cart);
};

exports.getCart = (req, res, next) => {
  controllersFactory.getOne(req, res, next, Cart);
};

exports.addToCart = async (req, res, next) => {
  try {
    const { id, productId } = req.params;
    const product = await Product.findById(productId);
    console.log('id', id);
    console.log('productId', productId);
    if (!product) {
      throw new ErrorCreator('There is no product with that id', 404);
    }
    const user = await User.findById(id);
    if (!user) {
      throw new ErrorCreator('There is no user with that id', 404);
    }
    const cart = await Cart.findByIdAndUpdate(
      user.cart,
      { $push: { products: product } },
      { new: true }
    );

    //Decrease one stock from product ? May be after checkout
    res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteFromCart = async (req, res, next) => {
  try {
    const { id, productId } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw new ErrorCreator('There is no user with that id', 404);
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorCreator('There is no product with that id', 404);
    }
    const cart = await Cart.findById(user.cart._id);
    if (!cart.products.includes(productId)) {
      throw new ErrorCreator('That product is not in the cart', 400);
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      user.cart._id,
      { $pull: { products: productId } },
      { new: true }
    ).populate({
      path: 'products',
    });
    res.status(200).json({ status: 'success', data: updatedCart });
  } catch (err) {
    next(err);
  }
};
