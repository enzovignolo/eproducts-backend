const { Router } = require('express');
const {productControllers} = require('../controllers/index');
const authControllers = require(`${__dirname}/../controllers/authControllers`);
const router = Router();

console.log('routers',productControllers)
router
	.route('/')
	.get(productControllers.getAllProducts)
	.post(authControllers.isAdmin, productControllers.createProduct);
router.route('/filter').get(productControllers.getFilteredProducts);
router
	.route('/:id')
	.get(productControllers.getOneProduct)
	.put(authControllers.isAdmin, productControllers.updateProduct)
	.delete(authControllers.isAdmin, productControllers.deleteProduct);
module.exports = router;
