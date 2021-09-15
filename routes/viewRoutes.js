const { Router } = require('express');
const viewControllers = require(`${__dirname}/../controllers/viewControllers`);

const router = Router();

//Products views
router.route('/products').get(viewControllers.viewAllProducts);

router
	.route('/addProduct')
	.get(viewControllers.isLogged, viewControllers.viewAddProductForm)
	.post(viewControllers.addProduct);

router
	.route('/login')
	.get(viewControllers.loginForm)
	.post(viewControllers.login);
router.route('/logout').post(viewControllers.logout);
module.exports = router;
