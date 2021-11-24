const { Router } = require('express');
const cartControllers = require(`${__dirname}/../controllers/cartControllers`);
const authControllers = require(`${__dirname}/../controllers/authControllers`);

const router = Router();

router
  .route('/')
  .get(cartControllers.getAllCarts)
  .post(authControllers.isAdmin, cartControllers.addCart);

router
  .route('/:id')
  .get(cartControllers.getCart)

  .delete(authControllers.isAdmin, cartControllers.deleteCart);

router
  .route('/:userId/producto/:productId')
  .put(cartControllers.addToCart)
  .delete(cartControllers.deleteFromCart);

module.exports = router;
