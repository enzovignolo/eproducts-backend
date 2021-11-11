const { Router } = require('express');
const productControllers = require(`${__dirname}/../controllers/productControllers`);
const authControllers = require(`${__dirname}/../controllers/authControllers`);
const router = Router();

router
	.route('/')
	.get(productControllers.getAllProducts)
	.post(authControllers.isAdmin, productControllers.addProduct);

router
	.route('/:id')
	.get(productControllers.getProduct)
	.put(authControllers.isAdmin, productControllers.updateProduct)
	.delete(authControllers.isAdmin, productControllers.deleteProduct);
module.exports = router;
