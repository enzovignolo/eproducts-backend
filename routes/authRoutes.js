const { Router } = require('express');
const authController = require(`${__dirname}/../controllers/authControllers.js`);

const router = Router();

router.route('/login').post(authController.login);

router.route('/signup').post((req, res, next) => {
  console.log('middleware');
  next();
}, authController.signup);

module.exports = router;
