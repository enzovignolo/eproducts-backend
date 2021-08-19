const { Router } = require('express');
const viewControllers = require(`${__dirname}/../controllers/viewControllers`);

const router = Router();

//Products views
router.route('/products').get(viewControllers.viewAllProducts);

router
	.route('/addProduct')
	.get(viewControllers.viewAddProductForm)
	.post(viewControllers.addProduct);

module.exports = router;
