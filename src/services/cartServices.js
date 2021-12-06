const Cart = require('../api/models/cartsModel');
const Product = require('../api/models/productsModel');
const User = require('../api/models/usersModel');
const ErrorCreator = require('../utils/ErrorCreator');

exports.addToCart = async (id, productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new ErrorCreator('There is no product with that id', 404);
    }
    console.log('idddd', id);
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
    return cart;
  } catch (err) {
    throw err;
  }
};

exports.deleteFromCart = async (id, productId) => {
  try {
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
    return updatedCart;
  } catch (err) {
    next(err);
  }
};
