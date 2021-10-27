const { Router } = require('express');
const viewControllers = require(`${__dirname}/../controllers/viewControllers`);
const passport = require('passport');
const router = Router();

//Products views
router.route('/products').get(viewControllers.viewAllProducts);

router
	.route('/addProduct')
	.get(viewControllers.isLogged, viewControllers.viewAddProductForm)
	.post(viewControllers.addProduct);
router
	.route('/signup')
	.get(viewControllers.signUpForm)
	.post(viewControllers.signup);
router
	.route('/login')
	.get(viewControllers.loginForm)
	.post(viewControllers.login);

router.route('/auth/callback').get(viewControllers.fbCallback);

router.route('/fbLogin').post(viewControllers.fbAuth);
router.route('/logout').post(viewControllers.logout);

router.route('/info').get(viewControllers.getInfo);

router.route('/randoms').get(viewControllers.randoms);
router.route('/').get((req, res) => res.redirect('/products'));

module.exports = router;
