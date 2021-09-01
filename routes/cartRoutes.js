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
	.route('/:cartId/producto/:productId')
	.put(authControllers.isAdmin, cartControllers.addToCart)
	.delete(authControllers.isAdmin, cartControllers.deleteFromCart);

module.exports = router;
