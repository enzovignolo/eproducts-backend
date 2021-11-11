const { deleteFromCart } = require('../services/cartServices');

const User = require(`${__dirname}/../models/usersModel`);

const Cart = require(`${__dirname}/../models/cartsModel.js`);
const Product = require(`${__dirname}/../models/productsModel.js`);
const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
const { addToCart } = require(`${__dirname}/../services/cartServices`);
const {
  getAll,
  getOne,
  addOne,
} = require(`${__dirname}/../services/factoryServices`);
exports.getAllCarts = async (req, res, next) => {
  try {
    const carts = await getAll(req.query, Cart);
    return res.status(200).json({ status: 'success', data: carts });
  } catch (err) {}
  /*   controllersFactory.getAll(req, res, next, Cart);
   */
};
exports.addCart = async (req, res, next) => {
  try {
    const newCart = await addOne(req.body, Cart);
    return res.status(201).json({ status: 'success', data: newCart });
  } catch (err) {
    next(err);
  }
  /*   controllersFactory.addOne(req, res, next, Product);
   */
};

exports.deleteCart = async (req, res, next) => {
  try {
    await deleteOne(req.params.id, Cart);
    return res.status(203).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
  /*   controllersFactory.deleteOne(req, res, next, Product);
   */
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOne(req.params.id, Cart);
    return res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    next(err);
  }
  /*  controllersFactory.getOne(req, res, next, User); */
};

exports.addToCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    /* const product = await Product.findById(productId);

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
 */
    const cart = await addToCart(userId, productId);
    //Decrease one stock from product ? May be after checkout
    return res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteFromCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const updatedCart = await deleteFromCart(userId, productId);
    return res.status(200).json({ status: 'success', data: updatedCart });
  } catch (err) {
    next(err);
  }
};
