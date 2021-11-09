const Cart = require(`${__dirname}/../models/cartsModel.js`);
const controllersFactory = require(`${__dirname}/controllersFactory.js`);
const cartControllers = require(`${__dirname}/cartControllers.js`);
const User = require(`${__dirname}/../models/usersModel.js`);
const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
const notifications = require(`${__dirname}/../utils/notifications.js`);
exports.getAllUsers = (req, res, next) => {
  controllersFactory.getAll(req, res, next, User);
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
    console.log(user.cart);
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
exports.getUser = (req, res, next) => {
  controllersFactory.getOne(req, res, next, User);
};

exports.updateUser = (req, res, next) => {
  controllersFactory.updateOne(req, res, next, User);
};

exports.deleteUser = (req, res, next) => {
  controllersFactory.deleteOne(req, res, next, User);
};
